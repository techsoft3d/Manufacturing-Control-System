var propertyWindow = null;
var partDataArray = new Array();
var sadArray = {}; //array of nodes with names not in nameMap :( useful for debugging the model

var minprice = 0.5;
var maxprice = 100;

var minstock = 0;
var maxstock = 500;
var pricerangeonoff = false;
var stockonoff = false;
var gradientonoff = false;
var outofstockOnOff = false;

function partData(uniqueid, name, cost, inventory) {
    this.uniqueid = uniqueid
    this.name = name;
    this.cost = parseFloat(cost);
    this.inventory = parseInt(inventory);
    if (cost < minprice)
        minprice = cost;
    if (cost > maxprice)
        maxprice = cost;
    if (inventory < minstock)
        minstock = inventory;
    if (inventory > maxstock)
        maxstock = inventory;
};

function getNodesWithName(root, callback) {
    var nName = viewer.getModel().getNodeName(root);
    if (nName != "unnamed" && viewer.getModel().getNodeType(root) == Communicator.NodeType.BodyInstance /*0*/) {
        if (nameMap[nName] != undefined) {
            partDataArray.push(new partData(root, nameMap[nName][0], nameMap[nName][1], nameMap[nName][2]));
        } else {
            sadArray[String(root)] = nName;
        }
    }
    var children = viewer.getModel().getNodeChildren(root);
    for (var i in children) {
        getNodesWithName(children[i]);
    }
    if (typeof callback === "function") {
        callback();
    }
}

function setPricerangeOnOff(val) {
    pricerangeonoff = val;
    if (!pricerangeonoff) {
        $("#gradientCheckbox").prop('disabled', true);
        $('#gradientLegend').css('visibility', 'hidden');
        priceRange.setAttribute('disabled', true);
    } else {
        $("#gradientCheckbox").prop('disabled', false);
        priceRange.removeAttribute('disabled');
    }
}

function setStockOnOff(val) {
    stockonoff = val;
    if (!stockonoff) {
        $("#outOfStockCheckbox").prop('disabled', true);
        stockRange.setAttribute('disabled', true);
    } else {
        $("#outOfStockCheckbox").prop('disabled', false);
        stockRange.removeAttribute('disabled');
    }
}

function handlePriceRangeOnOff(cb) {
    setPricerangeOnOff(cb.checked);
    updateManData();
}

function handleGradientOnOff(cb) {
    gradientonoff = cb.checked;
    if (gradientonoff) {
        $('#gradientLegend').css('visibility', 'visible');
    } else {
        $('#gradientLegend').css('visibility', 'hidden');
    }
    updateManData();
}

function handleoutofstockOnOff(cb) {
    outofstockOnOff = cb.checked;
    updateManData();
}

function handleStockOnOff(cb) {
    setStockOnOff(cb.checked);
    updateManData();
}

function resetVisibility() {
    hwv.setVisibilityByUniqueId();
}

function updateManData() {
    var manArray = new Array();

    $(".man").each(function (index) {
        var manName = this.innerText.split(" ");
        var sel = false;
        if (this.className.indexOf("ui-selected") != -1)
            manArray.push(manName[0]);
    });

    var i, j;
    var visibilityArray = new Array();
    var visibilityArray2 = new Array();
    var colorizeArray = new Array();
    var colorizeArray2 = new Array();

    var outofstockArray = new Array();

    var colorizeArrayColor = new Array();


    for (i = 0; i < partDataArray.length; i++) {

        if (partDataArray[i].inventory == 0 && outofstockOnOff && stockonoff)
            outofstockArray.push(partDataArray[i].uniqueid);

        if (partDataArray[i].inventory >= minstock && partDataArray[i].inventory <= maxstock && stockonoff)
            colorizeArray2.push(partDataArray[i].uniqueid);

        for (j = 0; j < manArray.length; j++) {
            if (partDataArray[i].name == manArray[j]) {
                visibilityArray.push(partDataArray[i].uniqueid);

                if (((partDataArray[i].cost >= minprice && partDataArray[i].cost <= maxprice)) && pricerangeonoff) {
                    colorizeArray.push(partDataArray[i].uniqueid);
                    if (gradientonoff) {
                        $('#gradientLegend').css('visibility', 'visible');
                        var rr = 255 * ((partDataArray[i].cost - minprice) / (maxprice - minprice));
                        var bb = 255 * (1 - ((partDataArray[i].cost - minprice) / (maxprice - minprice)));
                        var gg = 255 * (1 - Math.abs((partDataArray[i].cost - minprice) / (maxprice - minprice) - (1 - ((partDataArray[i].cost - minprice) / (maxprice - minprice)))));
                        var hp = { x: rr, y: gg, z: bb };
                        colorizeArrayColor.push(hp);
                    }
                } else {
                    visibilityArray2.push(partDataArray[i].uniqueid);
                }
            }
        }
    }

    var map = {};

    viewer.getModel().resetNodesColor();
    viewer.getModel().setNodesTransparency(colorizeArray, 0.5);
    if (gradientonoff) {
        viewer.getModel().setNodesVisibility(visibilityArray2, false);
        for (var i = 0; i < visibilityArray2.length; i++) {

        }
    }
    for (var i = 0; i < colorizeArray.length; i++) {
        if (!gradientonoff) {
            map[colorizeArray[i]] = new Communicator.Color(0, 0, 255);
        } else {
            map[colorizeArray[i]] = new Communicator.Color(colorizeArrayColor[i].x, colorizeArrayColor[i].y, colorizeArrayColor[i].z);
        }
    }



    viewer.getModel().setNodesColors(map);
    var rootNode = viewer.getModel().getRootNode();
    viewer.getModel().setNodesVisibility([rootNode], false);

    viewer.getModel().setNodesVisibility(visibilityArray, true);
    if (gradientonoff && pricerangeonoff) {
        viewer.getModel().setNodesVisibility(visibilityArray2, false);
    }
    var transparencyVal = 0.6;

    //viewer.getModel().resetNodesTransparency();
    viewer.getModel().resetModelTransparency();

    if (stockonoff) {
        viewer.getModel().setNodesTransparency([rootNode], 0.1);
        viewer.getModel().setNodesTransparency(colorizeArray2, 1.0);
        if (outofstockOnOff) {
            var oosMap = {};
            for (var i = 0; i < outofstockArray.length; i++) {
                oosMap[outofstockArray[i]] = new Communicator.Color(255, 0, 0);
            }
            viewer.getModel().setNodesColors(oosMap);
            viewer.getModel().setNodesTransparency(outofstockArray, 1);
        }
    } else {
        viewer.getModel().setNodesTransparency([rootNode], 1);
    }
}

function initDemo() {
    getNodesWithName(0, function () { });
    $("#amount").val("$" + minprice + " - $" + maxprice);
    $("#stock").val(minstock + " - " + maxstock);
    priceRange.setAttribute('disabled', true);
    stockRange.setAttribute('disabled', true);


    var _selectRange = false, _deselectQueue = [];
    $(function () {
        $("#selectable").selectable({
            selected: function (event, ui) {
                if ($('#selectable li:nth-child(1)').hasClass('ui-selected')) {
                    $('#selectable li').addClass('ui-selected');
                }
            },
            selecting: function (event, ui) {
                if ($(ui.selecting).hasClass('ui-selected')) {
                    _deselectQueue.push(ui.selecting);
                }

            },
            unselecting: function (event, ui) {
                $(ui.unselecting).addClass('ui-selected');
            },
            stop: function () {
                if (!_selectRange) {
                    $.each(_deselectQueue, function (ix, de) {
                        $(de)
                            .removeClass('ui-selecting')
                            .removeClass('ui-selected');

                        if ($("#selectable li:first-child").hasClass('ui-selected') == true) {
                            $("#selectable li:first-child").removeClass('ui-selected');
                        }

                        if ($("#selectable li").index(de) == 0 && $("#selectable li:first-child").hasClass('ui-selected') == false) {
                            $("#selectable li").each(function () {
                                $(this).removeClass('ui-selected');
                            });
                        }
                    });
                }
                _selectRange = false;
                _deselectQueue = [];

                if ($("#NameOfPart").val() != '') {
                    $('.collapse-image').css('opacity', '1.0');
                } else {
                    $('.collapse-image').css('opacity', '0.1');
                }
                updateManData();
            }
        });
    });

    $("#switchButton").click(function () {
        switchView();
    });

    propertyWindow = new PropertyWindowUniqueID();

    $("#manufactorerlistbox").change(function (t) {
        var x = document.getElementById("manufactorerlistbox");
        alert("Handler for .change() called." + x.value);
    });

}

function switchView() {
    var result = serialize();
    sessionStorage.setItem("product_data", JSON.stringify(result));

    if (window.location.href.indexOf("remote") == -1) {
        window.location.href = "manufacturing_demo_remote.html";
    }
    else {
        window.location.href = "manufacturing_demo_wgl.html";
    }
}

function restoreDataIfPresent() {
    var productData = sessionStorage.getItem("product_data");

    if (productData) {
        restoreState(JSON.safeParse(productData));
    }
}

function enableControls() {
    $('#manList').css('visibility', 'visible');
    $("#priceCheckbox").prop('disabled', false);
    $("#stockCheckbox").prop('disabled', false);
}
