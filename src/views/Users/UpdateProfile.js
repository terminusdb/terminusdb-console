<form onSubmit={ handleSubmit(onSubmit) }>
<FormInputs
  ncols={["col-md-5", "col-md-7"]}
  properties={[
    {
      label: "Account",
      type: "text",
      bsClass: "form-control",
      placeholder: "Company",
      defaultValue: "AccountName",
      readOnly: (!edit)
    },
    {
      label: "Email address",
      type: "email",
      bsClass: "form-control",
      placeholder: "Email",
      readOnly: (!edit)
    }
  ]}
/>
{(!edit) && <Button color="primary" onClick={clickEdit}>
    Edit </Button>}
{(edit) && <><Button color="primary pr"
    type = "Submit">
    Save </Button>
    <Button color="primary"
        onClick={clickCancel}
        type = "Submit">
        Cancel </Button></>}
<hr className="my-space-100"/>
<hr className="my-2"/>
<hr className="my-space-25"/>
<legend className="pr-hding-sp">{'Current Plan'}</legend>
<hr className="my-space-25"/>
<CardDecks/>
<hr className="my-space-50"/>
<Button color="primary" onClick={toggle}> Upgrade </Button>
<div className="clearfix" />
</form>