# Form Components Read Me

Pre-built templates for creating simple forms, grids and form controllers

All classes, layout, contents are configurable

But default for all styles will produce standard form elements as used throughout the console

constants.js contains the default values for all style sheets classes, strings, etc, as used by the module

This is intended on purely being an internal tool to allow us to build whatever forms and form layouts we need in a consistent way without us having to worry about 
the details and to allow us to change everything in one swoop because we expect never-ending design overhauls.

All Form elements are wrappers around bootstrap, they just parameterise the underlying bootstrap with classes and strings found in constants.js

## Usage - Top Down

The elements are described top down, in terms of their most common uses

1. <TCForm validate={} onSubmit={} onCancel={} report={} template={} layout={} elements={}>

You pass it a form, it draws it and gives you back a validated json with the form values

2. 
<TCGrid layout={3,4,3}>
    <TCFieldElement>
    <TCFieldElement>
    <TCFieldElement>
    <TCFieldElement>
    <TCFieldElement>
...
</TCGrid>

Will turn the enclosed field elements into the grid layout above. All field elements should remain pretty under all feasible layouts

<TCFieldElement>

Gives us a field as a grid

    row1 = [label] or row1 [label, help]
    
    if help is absent, the row is a single column, if not divided between label and help with helpCols (1-12) (default 6/6) setting the relative width of the two components

    row2 = [inputElement, gutter]

    (cowduck lives in the gutter - the gutter is as wide as the thing you put inside it)

    row3 = [errors] 

    Bar to show errors from specific form fields

The default CSS has height of the input elements constant (100px for row1, 30px for row3, 70 - 120 px for row2) but no widths. 


