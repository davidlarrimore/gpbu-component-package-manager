import { LightningElement, track, api } from "lwc";

export default class CpmComponentAvailableListView extends LightningElement {
  @api columnConfig;
  @api pkField;
  @track rows;
  _selectedRow;
  @api installedFilter = false;

  @api
  get rowData() {
    return this.rows;
  }

  set rowData(value) {
    if (typeof value !== "undefined") {
      this.rows = this.reformatRows(value);
    }
  }

  reformatRows = function (rowData) {
    let colItems = this.columnConfig;
    let reformattedRows = [];

    for (let i = 0; i < rowData.length; i++) {
      let rowDataItems = [];

      let isInstalled = false;
      for (let j = 0; j < colItems.length; j++) {
        let colClass = "slds-truncate";
        if (colItems[j].hiddenOnMobile) {
          colClass = colClass + " hiddenOnMobile";
        }

        if (rowData[i].Installed__c) {
          isInstalled = true;
        }
        let fieldValue = "";

        if (undefined === rowData[i][colItems[j].fieldName] || colItems[j].type !== "richText") {
          fieldValue = rowData[i][colItems[j].fieldName];
        } else {
          fieldValue = rowData[i][colItems[j].fieldName].replace(/(<([^>]+)>)/gi,"");
        }

        rowDataItems.push({
          value: fieldValue,
          label: colItems[j].label,
          type: colItems[j].type,
          class: colClass,
          columnId: "col" + j + "-" + rowData[i][this.pkField],
          isPhone: colItems[j].type === "phone",
          isEmail: colItems[j].type === "email",
          isRichText: colItems[j].type === "richText",
          isBoolean: colItems[j].type === "boolean",
          isOther:
            colItems[j].type !== "phone" &&
            colItems[j].type !== "email" &&
            colItems[j].type !== "boolean" &&
            colItems[j].type !== "richText"
        });
      }
      if (
        (this.installedFilter && isInstalled) ||
        (!this.installedFilter && !isInstalled)
      ) {
        reformattedRows.push({
          data: rowDataItems,
          pk: rowData[i][this.pkField]
        });
      }
    }
    return reformattedRows;
  };

  onRowClick(event) {
    let target = event.currentTarget;
    const evt = new CustomEvent("rowclick", {
      detail: {
        pk: target.getAttribute("data-pk"),
        domEl: target
      }
    });
    this.dispatchEvent(evt);
    this.highlightSelectedRow(target);
  }

  onRowDblClick(event) {
    let target = event.currentTarget;
    const evt = new CustomEvent("rowdblclick", {
      detail: {
        pk: target.getAttribute("data-pk"),
        domEl: target
      }
    });
    this.dispatchEvent(evt);
  }

  highlightSelectedRow(target) {
    if (this._selectedRow) {
      this._selectedRow.classList.remove("slds-is-selected");
    }
    target.classList.add("slds-is-selected");
    this._selectedRow = target;
  }

  @api
  setSelectedRecord(recordId) {
    let mySelector = `tr[data-pk='${recordId}']`;
    let selectedRow = this.template.querySelector(mySelector);
    if (selectedRow) {
      this.highlightSelectedRow(selectedRow);
    }
  }
}
