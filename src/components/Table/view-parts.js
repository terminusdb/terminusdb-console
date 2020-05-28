
<RowRule>
   <RuleEffect onClick={myOnClick} />
</RowRule>
      
<CellRule datatype="xsd:string">
   <CellRenderer>
        <TrimmedText maxword="32" maxlength="44" />
    </CellRenderer>
</CellRule>

<CellRule type="object">
   <CellRenderer>
      <TrimmedText maxword="32" maxlength="44" />
    </CellRenderer>
</CellRule>
