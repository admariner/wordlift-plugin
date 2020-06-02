import editMappingStore from "../store/edit-mapping-store";
import { EDIT_MAPPING_REQUEST_TERMS } from "../actions/action-types";

/**
 * EditComponentMapping : This maps the ui keys with api response keys and vice versa.
 *
 * @author Naveen Muthusamy <naveen@wordlift.io>
 * @since 3.24.0
 */

class EditComponentFilters {
  /**
   * @param {Array} rule_list List of rules
   *  Note: if the rule_id are undefined, then dont post it, backend
   *  creates new rule id if there is no id.
   */
  static mapRuleFieldKeysToAPI(rule_list) {
    return rule_list.map(function(rule) {
      const single_rule = {
        rule_field_one: rule.ruleFieldOneValue,
        rule_field_two: rule.ruleFieldTwoValue,
        rule_logic_field: rule.ruleLogicFieldValue
      };
      // If the rule id is not zero, then we set the rule id, if it is zero, then we dont
      // pass the rule id parameter, REST API creates a new rule item if this param is not passed.
      rule.rule_id ? (single_rule["rule_id"] = rule.rule_id) : rule.rule_id;
      return single_rule;
    });
  }

  /**
   * Convert property list to api format to save the property
   * list propertly
   * @param {Array} property_list List of property items from ui
   */
  static mapPropertyListKeysToAPI(property_list) {
    return property_list.map(property => {
      // Conditionally remove property id, if it is added by user.
      const propertyItem = {
        property_name: property.propertyHelpText,
        field_type: property.fieldTypeHelpText,
        field_name: property.fieldHelpText,
        transform_function: property.transformHelpText,
        property_status: property.propertyStatus
      };
      // If it is created in the ui, then remove the property id, rest api will detect this and
      // create a new entry for the property.
      if (!property.isPropertyAddedViaUI) {
        propertyItem.property_id = parseInt(property.property_id);
      }
      return propertyItem;
    });
  }

  /**
   * Convert property list API Response to ui format
   * @param {Array} property_list The list of properties
   * from API.
   * @return {Array} New array with mapped keys.
   */
  static mapPropertyAPIKeysToUi(property_list) {
    return property_list.map(property => ({
      // variable case changed because after mapping this data is going
      // to the REST API, so camelcase cant be used here.
      propertyHelpText: property.property_name,
      fieldTypeHelpText: property.field_type,
      fieldHelpText: property.field_name,
      transformHelpText: property.transform_function,
      property_id: parseInt(property.property_id),
      propertyStatus: property.property_status,
      isOpenedOrAddedByUser: false,
      isSelectedByUser: false,
      isPropertyAddedViaUI: false
    }));
  }

  static mapRuleFieldAPIKeysToUi(rule_list) {
    return rule_list.map(rule => ({
      ruleFieldOneValue: rule.rule_field_one,
      ruleFieldTwoValue: rule.rule_field_two,
      ruleLogicFieldValue: rule.rule_logic_field,
      rule_id: rule.rule_id
    }));
  }

  /**
   * @param {Array} rule_group_list List of rule group items from api
   */
  static mapRuleGroupListAPIKeysToUi(rule_group_list) {
    return rule_group_list.map(rule_group_item => ({
      rule_group_id: rule_group_item.rule_group_id,
      rules: EditComponentFilters.mapRuleFieldAPIKeysToUi(rule_group_item.rules)
    }));
  }

  /**
   * Map Rule group list to api format to save the list.
   * @param {Array} rule_group_list List of rule groups along with rules
   * from ui
   * Note: if the rule_group_ids are undefined, then dont post it, backend
   * creates new rule group if there is no id.
   */
  static mapRuleGroupListKeysToAPI(rule_group_list) {
    return rule_group_list.map(function(rule_group_item) {
      const single_rule_group_item = {
        rules: EditComponentFilters.mapRuleFieldKeysToAPI(rule_group_item.rules)
      };
      if (rule_group_item.rule_group_id) {
        single_rule_group_item.rule_group_id = rule_group_item.rule_group_id;
      }
      return single_rule_group_item;
    });
  }

  /**
   * Map the store keys to api keys before sending it to api.
   * Note: Lower case variables are sent to API.
   * @param store Redux Store for edit mappings.
   * @returns {{property_list: ([]|[{fieldHelpText: string, transformHelpText: string, isOpenedOrAddedByUser: boolean, propertyHelpText: string, fieldTypeHelpText: string}, {fieldHelpText: string, transformHelpText: string, isOpenedOrAddedByUser: boolean, propertyHelpText: string, fieldTypeHelpText: string}]|{fieldHelpText: string, transformHelpText: string, isOpenedOrAddedByUser: boolean, propertyHelpText: string, fieldTypeHelpText: string}), mapping_title: (string), rule_group_list: ([]|[{rules: [{}]}, {rules: [{}]}]|{rules: [{}]})}}
   */
  static mapStoreKeysToAPI(store) {
    // We create a post object to transform the ui data to Api data
    const postObject = {
      mapping_title: store.TitleSectionData.title,
      property_list: store.PropertyListData.propertyList,
      rule_group_list: store.RuleGroupData.ruleGroupList
    };
    if (store.TitleSectionData.mapping_id !== undefined) {
      postObject.mapping_id = store.TitleSectionData.mapping_id;
    }
    postObject.rule_group_list = EditComponentFilters.mapRuleGroupListKeysToAPI(postObject.rule_group_list);
    postObject.property_list = EditComponentFilters.mapPropertyListKeysToAPI(postObject.property_list);
    return postObject;
  }

  /**
   * Returns a list of taxonomies which are currently selected
   * in the rule component.
   * @param ruleGroupList
   * @return {Array} Array of taxonomies.
   */
  static getUniqueTaxonomiesSelected(ruleGroupList) {
    const taxonomies = [];
    let rules = [];
    ruleGroupList.map(e => {
      rules = rules.concat(e.rules);
    });

    for (let rule of rules) {
      const taxonomy = rule.ruleFieldOneValue;
      // Dont include post type.
      if (taxonomies.includes(taxonomy) || taxonomy === "post_type") {
        continue;
      }
      taxonomies.push(taxonomy);
    }
    return taxonomies;
  }
}

export default EditComponentFilters;
