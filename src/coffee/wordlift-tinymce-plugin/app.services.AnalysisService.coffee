# The AnalysisService aim is to parse the Analysis response from an analysis process
# and create a data structure that's is suitable for displaying in the UI.
# The main method of the AnalysisService is parse. The parse method includes some
# helpful functions.
# The return is a structure like this:
#  - language : the language code for the specified post.
#  - languages: an array of languages (and related confidence) identified for the provided text.
#  - entities : the list of entities for the post, each entity provides:
#     - label      : the label in the post language.
#     - description: the description in the post language.
#     - type       : the known type for the entity
#     - types      : a list of types as provided by the entity
#     - thumbnails : URL to thumbnail images

angular.module( 'AnalysisService', [] )
  .service( 'AnalysisService', [ '$http', '$q', '$log', ($http, $q, $log) ->

    parse: (data) ->

      languages         = []
      textAnnotations   = {}
      entityAnnotations = {}
      entities          = {}

      # support functions:

      # Get the known type given the specified types. Current supported types are:
      #  * person
      #  * organization
      #  * place
      getKnownType = (types) ->
        return null if not types?
        typesArray = if angular.isArray types then types else [ types ]
        return 'person'       for type in typesArray when 'http://schema.org/Person' is expand(type)
        return 'person'       for type in typesArray when 'http://rdf.freebase.com/ns/people.person' is expand(type)
        return 'organization' for type in typesArray when 'http://schema.org/Organization' is expand(type)
        return 'organization' for type in typesArray when 'http://rdf.freebase.com/ns/government.government' is expand(type)
        return 'organization' for type in typesArray when 'http://schema.org/Newspaper' is expand(type)
        return 'place'        for type in typesArray when 'http://schema.org/Place' is expand(type)
        return 'place'        for type in typesArray when 'http://rdf.freebase.com/ns/location.location' is expand(type)
        return 'event'        for type in typesArray when 'http://schema.org/Event' is expand(type)
        return 'event'        for type in typesArray when 'http://dbpedia.org/ontology/Event' is expand(type)
        return 'music'        for type in typesArray when 'http://rdf.freebase.com/ns/music.artist' is expand(type)
        return 'music'        for type in typesArray when 'http://schema.org/MusicAlbum' is expand(type)
        return 'place'        for type in typesArray when 'http://www.opengis.net/gml/_Feature' is expand(type)

#        $log.debug "[ types :: #{typesArray} ]"
        'thing'

      # create an entity.
      createEntity = (item, language) ->
        id         = get('@id', item)
        types      = get('@type', item)
        thumbnails = get('foaf:depiction', item)
        freebaseThumbnails = get('http://rdf.freebase.com/ns/common.topic.image', item)
        freebaseThumbnails = if angular.isArray freebaseThumbnails then freebaseThumbnails else [ freebaseThumbnails ]
        freebaseThumbnails = ("admin-ajax.php?action=wordlift_freebase_image&url=#{escape(thumbnail)}" for thumbnail in freebaseThumbnails)
        thumbnails = thumbnails.concat freebaseThumbnails

        # create the entity model.
        entity = {
          id          : id
          thumbnail   : null
          thumbnails  : thumbnails
          type        : getKnownType(types)
          types       : types
          description : getLanguage('rdfs:comment', item, language)
          descriptions: get('rdfs:comment', item)
          label       : getLanguage('rdfs:label', item, language)
          labels      : get('rdfs:label', item)
          source      : if id.match('^http://rdf.freebase.com/.*$') then 'freebase' else 'dbpedia'
          _item       : item
        }

        # remove not found thumbnails.
        if thumbnails?
          $log.debug thumbnails
          $q.all(($http.head thumbnail for thumbnail in thumbnails))
            .then (results) ->
              entity.thumbnails = (result.config.url for result in results when 200 is result.status)
              entity.thumbnail  = entity.thumbnails[0] if 0 < entity.thumbnails.length


        # return the entity.
        entity

      createEntityAnnotation = (item) ->
        # get the related text annotation.
        textAnnotation = textAnnotations[get('dc:relation', item)]

        entity = {
          id        : get('@id', item),
          label     : get('enhancer:entity-label', item),
          confidence: get('enhancer:confidence', item),
          entity    : entities[get('enhancer:entity-reference', item)],
          relation  : textAnnotations[get('dc:relation', item)],
          _item     : item
        }

        # create a binding from the textannotation to the entity.
        textAnnotation.entityAnnotations[entity.id] = entity if textAnnotation?

        # return the entity.
        entity


      createTextAnnotation = (item) ->
        {
          id               : get('@id', item),
          selectedText     : get('enhancer:selected-text', item)['@value'],
          selectionPrefix  : get('enhancer:selection-prefix', item)['@value'],
          selectionSuffix  : get('enhancer:selection-suffix', item)['@value'],
          confidence       : get('enhancer:confidence', item),
          entityAnnotations: {},
          _item            : item
        }

      createLanguage = (item) ->
        {
          code      : get('dc:language', item),
          confidence: get('enhancer:confidence', item)
          _item     : item
        }

      # get the provided key from the container, expanding the keys when necessary.
      get = (what, container) ->
        # expand the what key.
        whatExp = expand(what)
        # return the value bound to the specified key.
        return value for key, value of container when whatExp is expand(key)
        []

      # get the value for specified property (what) in the provided container in the specified language.
      # items must conform to {'@language':..., '@value':...} format.
      getLanguage =  (what, container, language) ->
        # if there's no item return null.
        return if null is items = get(what, container)
        # transform to an array if it's not already.
        items = if angular.isArray items then items else [ items ]
        # cycle through the array.
        return item['@value'] for item in items when language is item['@language']
        # if not found return null.
        null

      containsOrEquals = (what, where) ->
        # if where is not defined return false.
        return false if not where?
        # ensure the where argument is an array.
        whereArray = if angular.isArray where then where else [ where ]
        # expand the what string.
        whatExp    = expand(what)
        # return true if the string is found.
        return true for item in whereArray when whatExp is expand(item)
        # otherwise false.
        false

      # expand a string to a full path if it contains a prefix.
      expand = (content) ->
        # if there's no prefix, return the original string.
        if null is matches = content.match(/([\w|\d]+):(.*)/)
          return content

        # get the prefix and the path.
        prefix  = matches[1]
        path    = matches[2]

        # if the prefix is unknown, leave it.
        prepend = if prefixes[prefix]? then prefixes[prefix] else "#{prefix}:"

        # return the full path.
        prepend + path

      # data is split in a context and a graph.
      context  = data['@context']
      graph    = data['@graph']

      # get the prefixes.
      prefixes = []

      # cycle in the context definitions and extract the prefixes.
      for key, value of context
        # consider a prefix only keys w/o ':' and the value is string.
        if -1 is key.indexOf(':') and angular.isString(value)
          # add the prefix.
          prefixes[key] = value

      for item in graph
        id     = item['@id']
        types  = item['@type']
        dctype = get('dc:type', item)

        # TextAnnotation/LinguisticSystem
        if containsOrEquals('enhancer:TextAnnotation', types) and containsOrEquals('dc:LinguisticSystem', dctype)
          languages.push createLanguage(item)

        # TextAnnotation
        else if containsOrEquals('enhancer:TextAnnotation', types)
#          $log.debug "TextAnnotation [ @id :: #{id} ][ types :: #{types} ]"
          textAnnotations[id] = item

        # EntityAnnotation
        else if containsOrEquals('enhancer:EntityAnnotation', types)
#          $log.debug "EntityAnnotation [ @id :: #{id} ][ types :: #{types} ]"
          entityAnnotations[id] = item

        # Entity
        else
#          $log.debug "Entity [ @id :: #{id} ][ types :: #{types} ]"
          entities[id] = item

      # sort the languages by confidence.
      languages.sort (a, b) ->
        if a.confidence < b.confidence
          return -1
        if a.confidence > b.confidence
          return 1
        0

      # create a reference to the default language.
      language = languages[0].code

      # create entities instances in the entities array.
      for id, item of entities
        entity       = createEntity(item, language)
        entities[id] = entity

      # create entities instances in the entities array.
      textAnnotations[id] = createTextAnnotation(item) for id, item of textAnnotations

      # create entities instances in the entities array.
      entityAnnotations[id] = createEntityAnnotation(item) for id, item of entityAnnotations

      # return the analysis result.
      {
        language         : language,
        entities         : entities,
        entityAnnotations: entityAnnotations,
        textAnnotations  : textAnnotations,
        languages        : languages
      }

  ])