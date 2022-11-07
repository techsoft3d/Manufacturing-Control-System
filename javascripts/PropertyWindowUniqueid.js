function PropertyWindowUniqueID() {
    this.parentSelectionActive = false;
}

PropertyWindowUniqueID.prototype._initPropertyWindow = function () {
    var self = this;
}

PropertyWindowUniqueID.prototype.onSelection = function (selection) {
    function changeColor() {
        if ($("#NameOfPart").val() != '') {
            $('.collapse-image').css('opacity', '1.0');
        } else {
            $('.collapse-image').css('opacity', '0.1');
        }
    }
    window.setTimeout(changeColor, 50);
    var i = 0;
    $("#Price").val("");
    $("#NameOfPart").val("");
    $("#NameOfManufacturer").val("");
    $("#InStock").val("");
    $("#uniqueidofpart").val("");

    uid = selection.getSelection().getNodeId();

    var name = viewer.getModel().getNodeName(uid);
    this.parentSelectionActive = false;
    if (uid == undefined)
        return;


    $("#NameOfPart").val(name);
    $("#uniqueidofpart").val(uid);

    var i, j;
    for (i = 0; i < partDataArray.length; i++) {
        if (uid == partDataArray[i].uniqueid) {
            $("#NameOfManufacturer").val(partDataArray[i].name);
            $("#Price").val("$" + partDataArray[i].cost);
            if (partDataArray[i].inventory == 1)
                $("#InStock").val(partDataArray[i].inventory + " Unit");
            else
                $("#InStock").val(partDataArray[i].inventory + " Units");

            break;
        }
    }



}

PropertyWindowUniqueID.prototype.reposition = function (x, y) {
}

PropertyWindowUniqueID.prototype.setProperties = function (properties) {
}

PropertyWindowUniqueID.prototype.show = function () {
    $(this.propertyWindowSelector).show();
}

PropertyWindowUniqueID.prototype.hide = function () {
    $(this.propertyWindowSelector).hide();
}

PropertyWindowUniqueID.prototype._addPropertyIfPresent = function (name, properties) {
}
