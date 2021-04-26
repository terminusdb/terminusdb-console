import { HUBDB } from "../../constants/images"

//TO BE REMOVED
//we don't use this components
export const OrganizationalHeader = ({organization}) => {
   /* const {bffClient} = WOQLClientObj()
    let u = bffClient.user()
    let orgs = u.organizations
    let o = false
    for(var i = 0; i<orgs.length; i++){
        if(orgs[i].organization == organization){
            o = orgs[i]
            break
        }
    }
    if(!o){
        o = {
            organization: organization,
            organization_type: "Personal",
            organization_icon: HUBDB,
            organization_label: "Unknown",
            organization_comment: "This publisher does not exist"
        }
    }
    else {
        console.log(o)
    }

    return <div className='organization-hub-header'>
        <span className='organization-hub-image'>
            <HubOrgImage icon={o.organization_icon} />
        </span>
        <span className='organization-hub-credits'>
            <Row className='organization-hub-name'>
               <OrgBadge type={o.organization_type} />  {o.organization_label}
            </Row>
            <Row className='organization-hub-description'>
                {o.organization_comment}
            </Row>
        </span>
    </div>*/
}

/*
export const HubOrgImage = ({icon}) => {
    let vi = validURL(icon)
    if(vi){
        return (
            <img className='organization-home-listing-image' src={icon}/>
        )
    }
    else {
        return (
            <i className={'organization-listing-icon ' + icon} />
        )
    }
}

export const OrgBadge = ({type}) => {
    if(type == "Professional"){
        return <AiFillStar title='Verified Professional Publisher' className="pro-badge" />
    }
    return null
}*/
