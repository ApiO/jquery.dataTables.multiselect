# jquery.dataTables.multiselect

Extension of **[jquery.dataTables](https://www.datatables.net/)** plugin for multi-selection.

![](http://acuisinier.com/images/jquery.dataTables.multiselect.png)

## Documentation & demo

> For code sample check out the *index.html* file or go to [live demo](http://acuisinier.com).
  
**Minimal browser compatibility**

Web browser|Version 
-|-
Chrome|Ok
Firefox|v3.5
IE|v9
Opera|v10
Safari|v4

**Features**

- Override jQuery val() to get/set the current value.
- Trigger "change" event.
- Allow you to define your own awesome style.
  
**Usage**

```html
<!-- Add a checkbox to your page -->
<input type="checkbox" id="my_checkbox" />
 ```
 
```javascript
// Initialize the plugin
$("#my_checkbox").triSwitch();
```
 
	
```javascript
// Using options
$("#my_checkbox").triSwitch({ 
	loop: false, 
	defaultValue:  1 
});
```
	
```javascript
// Binding change event notification
$("#my_checkbox").on("change", function () {
	alert($(this).val());
});
```
	
```javascript
// Disable change notification with style
$("#my_checkbox").attr("disabled", true);
```
  
**Options**

Name | Type | Default | Description
-|-|-|-
loop | boolean | true | Define the state cycle.  true: uncheck > both > check / false: uncheck > check
defaultValue | number | -1 | Sets the initial state.  -1: unchecked / 0: both / 1: checked
  
**Callback events**

Event | Description
-|-
change | Triggered each time the user click on a checkbox
  
## License

Released under the [MIT license](http://www.opensource.org/licenses/MIT).