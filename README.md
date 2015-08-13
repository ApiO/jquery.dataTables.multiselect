# jquery.dataTables.multiselect

Extension of **[jquery.dataTables](https://www.datatables.net/)** plugin for multi-selection.

![](http://acuisinier.com/images/jquery.dataTables.multiselect.png)

## Documentation & demo

> For code sample check out the *index.html* file or go to [live demo](http://acuisinier.com).
  
**Minimal browser compatibility**

Web browser|Version 
---|---
Chrome|Ok
Firefox|v3.5
IE|v9
Opera|v10
Safari|v4

**Features**

- Drag & drop onto table row to select a range of rows.
- Selected rows are styled.
- Hold Ctrl to add item to an existing selection.
- dataTables trigger "*selectionChanged.dt*" event and send data rows array to callback. 
- You can enable/disable selection by code with the function: *selectable(bool)*
- Allow multiple instance of selectable dataTables on the same page.
  
**Usages**

```html
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