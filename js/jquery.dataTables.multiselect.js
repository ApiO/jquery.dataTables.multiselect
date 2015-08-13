/*
 * jquery.dataTables.multiselect
 * 2015 - Adrien Cuisinier
 * Released under the MIT license.
 * v1.0.0
 */

(function ($) {
    //* UTILS *//
    $.fn.withinBox = function (left, top, width, height, useOffsetCache) {
        var ret = [];
        this.each(function () {
            var q = $(this);
            if (this === document.documentElement) return ret.push(this);
            var offset = useOffsetCache ? $.data(this, "offset") || $.data(this, "offset", q.offset()) : q.offset();
            var ew = q.width(),
                eh = q.height(),
                res = !((offset.top > top + height) || (offset.top + eh < top) || (offset.left > left + width) || (offset.left + ew < left));

            if (res) ret.push(this);
            return true;
        });
        return this.pushStack($.unique(ret), "withinBox", $.makeArray(arguments).join(","));
    };

    $.fn.exists = function () { return this.length > 0; };

    function arrayRemove(a, val) {
        return $.grep(a, function (value) {
            return value !== val;
        });
    }

    //* PRIVATES *//

    // Extension cache
    var dtContext = {
        areaSelectorName: "#dataTables-area-selector",
        areaSelector: null,
        multiSelection: false,
        mouseSartTarget: null,
        mouseDownFired: false,
        mouseDragStart: false,
        mouseDragStartPos: { x: 0, y: 0 },
        current: null
    };

    // DataTable extension data
    function selection() {
        var self = this;
        self.items = [];
        self.remove = function (value) {
            self.items = arrayRemove(self.items, value);
        };
        self.clear = function () {
            self.items.length = 0;
        };
    }

    function dtGetTable(element) {
        return $(element).closest("table");
    }

    function dtGetTableId(element) {
        return dtGetTable(element).attr("id");
    }

    // Clear both data and UI selected items
    function dtClearSelection() {
        var table = "#" + dtGetTableId(dtContext.mouseSartTarget);
        $(table + " tbody tr.selected").removeClass("selected");
        $(table).data().selection.clear();
    }

    // Updatesz row data selection state
    function dtUpdateRowDataSelection(tr, insert) {
        var table = "#" + dtGetTableId(tr);
        var data = $(table).DataTable().row(tr).data();
        if (insert) {
            $(table).data().selection.items.push(data);
        } else {
            $(table).data().selection.remove(data);
        }
    }

    // Returns selection array
    function dtGetSelection(element) {
        return $(element).closest("table").data().selection;
    }

    // Returns css value as int
    function dtGetCssDim(attr) {
        return parseInt(dtContext.areaSelector.css(attr).replace("px", ""));
    }

    function dtSetAreaSelector(top, left, width, height) {
        dtContext.areaSelector
            .css("top", top)
            .css("left", left)
            .css("width", width + "px")
            .css("height", height + "px");
    }

    // Changes backgrounds of selected items
    function dtSelectRows() {
        if (!dtContext.multiSelection) {
            dtClearSelection();
        }
        var top = dtGetCssDim("top");
        var left = dtGetCssDim("left");
        var width = dtGetCssDim("width");
        var height = dtGetCssDim("height");

        var items = $(dtContext.current + " tbody > tr").withinBox(left, top, width, height);
        $.each(items, function (i, item) {
            if ($(item).hasClass("selected")) return;
            $(item).addClass("selected");
            dtUpdateRowDataSelection(item, true);
        });
    }

    // Updates graphical selection square
    function dtUpdateMouseSelection(event) {
        var top, left, width, height;
        if (event.pageX > dtContext.mouseDragStartPos.x &&
            event.pageY > dtContext.mouseDragStartPos.y) {
            top = dtContext.mouseDragStartPos.y;
            left = dtContext.mouseDragStartPos.x;
            width = event.pageX - dtContext.mouseDragStartPos.x;
            height = event.pageY - dtContext.mouseDragStartPos.y;
        } else if (event.pageX < dtContext.mouseDragStartPos.x &&
                   event.pageY < dtContext.mouseDragStartPos.y) {
            top = event.pageY;
            left = event.pageX;
            width = dtContext.mouseDragStartPos.x - event.pageX;
            height = dtContext.mouseDragStartPos.y - event.pageY;
        } else if (event.pageY < dtContext.mouseDragStartPos.y) {
            top = event.pageY;
            left = dtContext.mouseDragStartPos.x;
            width = event.pageX - dtContext.mouseDragStartPos.x;
            height = dtContext.mouseDragStartPos.y - event.pageY;
        } else {
            top = dtContext.mouseDragStartPos.y;
            left = event.pageX;
            width = dtContext.mouseDragStartPos.x - event.pageX;
            height = event.pageY - dtContext.mouseDragStartPos.y;
        }

        dtSetAreaSelector(top, left, width, height);

        dtSelectRows();
    }

    function dtEnableExtendedSelection(table) {
        $(table)
            .on("mousedown", "tbody > tr > td:not(.dataTables_empty):not(.dataTables_noselect)", function (event) {
                var table = dtGetTable(this);
                if (table.attr("disabled") || !table.data().active) return;

                // set context
                dtContext.current = "#" + dtGetTableId(this);
                dtContext.mouseDownFired = true;
                dtContext.mouseSartTarget = event.target;
                dtContext.mouseDragStart = true;
                dtContext.mouseDragStartPos.x = event.pageX;
                dtContext.mouseDragStartPos.y = event.pageY;
                dtContext.areaSelector.show();
                dtSetAreaSelector(event.pageY, event.pageX, 1, 1);
                // handle first click
                var tr = $(event.target).closest("tr");
                if (!dtContext.multiSelection) {
                    var force = dtGetSelection(tr).items.length > 1 &&
                                tr.hasClass("selected");
                    dtClearSelection();
                    if (force || !tr.hasClass("selected")) {
                        tr.addClass("selected");
                        dtUpdateRowDataSelection(tr, true);
                    }
                } else {
                    tr.toggleClass("selected");
                    dtUpdateRowDataSelection(tr, tr.hasClass("selected"));
                }
                // fallow mouse moves
                $(window).on("mousemove", dtUpdateMouseSelection);
            });
    }

    function dtUiRefreshSelection() {
        if ($("tbody tr td.dataTables_empty", this).length) return;

        var table = $(this);
        $("tbody tr.selected", this).removeClass("selected");

        var selections = table.data().selection.items;

        var rowData, found;
        $.each($("tbody tr", this), function (i, tr) {
            rowData = table.DataTable().row(tr).data();
            found = false;

            $.each(selections, function (i, item) {
                if (item !== rowData) return true;
                found = true;
                return false;
            });

            if (found) {
                $(tr).addClass("selected");
            }
        });
    }

    function dtPropagateSelectionChanged() {
        var table = dtGetTable(dtContext.mouseSartTarget);
        table.trigger("selectionChanged.dt",
            [{ data: table.data().selection.items }]);
    }

    function dtInitPersitancy() {
        if (!$(dtContext.areaSelectorName).exists()) {
            var img = $("<img id=\"dataTables-area-selector\" style=\"display: none;\" alt=\"\">");
            img.addClass("dataTables-selector");
            $("body").prepend(img);

            dtContext.areaSelector = $(dtContext.areaSelectorName);

            $(window).on("mouseup", function () {
                if (!dtContext.mouseDragStart) return;

                dtPropagateSelectionChanged();

                $(window).off("mousemove");

                dtContext.mouseDragStart = false;
                dtContext.areaSelector.hide();
                dtContext.current = null;
            });

            $(document)
                .on("keydown", function (e) {
                    if (e.keyCode !== 17 || dtContext.multiSelection) return;
                    dtContext.multiSelection = true;

                })
                .on("keyup", function (e) {
                    if (e.keyCode !== 17 || !dtContext.multiSelection) return;
                    dtContext.multiSelection = false;
                });
        }
    }

    //* MAIN *//

    $.fn.enableExtendedSelection = function () {
        if (!$(this).is("table")) {
            console.error("Table element expected");
            return;
        }
        dtInitPersitancy();

        $(this)
            .data("selection", new selection())
            .data("active", true)
            .on("draw.dt", dtUiRefreshSelection)
            .attr("data-multiSelectable", true);

        dtEnableExtendedSelection("#" + $(this).attr("id"));
    };

    $.fn.selectable = function (bool) {
        if (!$(this).is("table")) {
            throw "Table element expected";
        }
        if (bool === "undefined") {
            throw "Parameter expected";
        }
        $(this).data().active = bool;
    };
    return $;
})(jQuery);