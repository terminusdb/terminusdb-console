import * as query from "../labels/queryLabels";

export const schemaLib = [
    {text: 'Show All Schema Elements',
     queryName: query.SHOW_ALL_SCHEMA_ELEMENTS,
     action: 'elementMetadata'},
    {text: 'Show All Classes',
     queryName: query.SHOW_ALL_CLASSES,
     action: 'classMetadata'},
    {text: 'Show Document Classes',
     queryName: query.SHOW_DOCUMENT_CLASSES,
     action: 'concreteDocumentClasses'},
    {text: 'Show All Properties',
     queryName: query.SHOW_ALL_PROPERTIES,
     action: 'propertyMetadata'}]

export const dataLib = [
    {text: 'Show data of Type'},
    {text: 'Show data of Property'},
    {text: 'Show All Data'}]

export const documentLib = [
    {text: 'Show All Documents'}]

export const libs = [{text: 'Schema library', control: schemaLib},
    {text: 'Data Library', control: dataLib},
    {text: 'Document Library', control: documentLib}]
