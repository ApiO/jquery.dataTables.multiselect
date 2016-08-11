# jquery.dataTables.multiselect

[![NuGet](https://img.shields.io/nuget/v/jquery.dataTables.multiselect.svg)](https://www.nuget.org/packages/jquery.dataTables.multiselect) [![license](https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000)](https://opensource.org/licenses/MIT)

Extension of **[jquery.dataTables](https://www.datatables.net/)** plugin for multi selection.
> If you are using jquery.dataTables 1.10.8 or above, use [Select](http://datatables.net/extensions/select/) and [AreaSelect](https://github.com/ApiO/jquery.dataTables.areaselect) extensions.

![](http://acuisinier.com/images/jquery.dataTables.multiselect.png)

## Documentation & demo

> For code sample check out the *index.html* file or go to [live demo](http://acuisinier.com/demo/jquery.dataTables.multiselect).

**Minimal browser compatibility**

Web browser|Version 
---|---
Chrome|Ok
Firefox|v3.5
IE|v9
Opera|v10
Safari|v4

**Dependencies**

> **jQuery v1.11.3** at least. Works perfectly on higher versions.  
> **jquery.dataTables v1.10.7** or higher version *without the Select extension*.


**Features**

- Drag & drop onto table row to select a range of rows.
- Selected rows are styled.
- Hold Ctrl to add item to an existing selection.
- dataTables trigger "*selectionChanged.dt*" event and send data rows array to callback. 
- You can enable/disable selection by code with the function: *selectable(bool)*
- Allow multiple instance of selectable dataTables on the same page.
  
**Usages**

```html
	<!-- reference both css and js files -->
    <link href="css/jquery.dataTables.multiselect.css" rel="stylesheet">
    <script src="js/jquery.dataTables.multiselect.js"></script>
    
	<!-- Add a table to your page -->
	<table id="my_table"></table>
 ```
 
```javascript
  $("#my_table")
      // initializes dataTable as usual
      .dataTable({
          data: ...,
          columns: [ ... ],
          initComplete: function () {
              // enables multi selection extension
              $("#my_table").enableExtendedSelection();
          }
      })
      // binds callback to selection change event
      .on("selectionChanged.dt", function (event, params) {
          console.info("Selection", params.data);
      });
```
 
```javascript
	// to get the current selection by code
	var arr = $("#my_table").data().selection.items;
```
 
```javascript
	// Disable/enable multiselection
	$("#my_table").selectable(false/true);
```
 
  
**Callback events**

Event | Description
---|---
selectionChanged.dt|Triggered when the selection changed.
  
## License

Released under the [MIT license](http://www.opensource.org/licenses/MIT).
