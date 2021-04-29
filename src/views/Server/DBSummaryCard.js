import {DBSummaryCard} from './DBSummaryCard'

export const DBSummaryCard = ({meta, user, title_max, onAction}) => {
    const [loading, setLoading] = useState()
   
    meta.action = (onAction ? _user_db_action(meta, user) : false)

    

    function loadHubDB(){
        meta.action = "hub"
        onGo()
    }

    function onGo(){
        if(onAction){
            if(!meta.action) return
            onAction(meta)
        }
    }
    

    return (
        <div className="tdb__dblist__item">
            {loading &&
                <Loading type={TERMINUS_COMPONENT} />
            }
            {!loading && <>
                <DBControlPanel meta={meta} user={user} />
                 <div className="tdb__dblist__center">
                    
                    <DBTitle meta={meta} user={user} max={title_max} goHubDB={loadHubDB}/>

                    <DBCredits meta={meta}  user={user} />
                    
                    <DBDescription meta={meta}  user={user} />
                    
                    {meta.type == "invite" &&
                        <DBInvite meta={meta}/>
                    
                    }
                </div>

                <div className="tdb__dblist__action">
                    {user.logged_in &&
                        <DBStatus meta={meta}  user={user}  onAction={onGo}/>
                    }
                </div>
            </>}
        </div>
    )
}

//what is the primary action available to the user
function _user_db_action(meta, user){
    if(meta.remote_url){
        if(user.logged_in){
            if(!meta.id){
                if(meta.type == "invite") return "accept"
                return 'clone'
            }
            if(meta.type == 'local_clone'){
                return 'synchronise'
            }
            else if(meta.type == 'remote' && meta.remote_record && meta.remote_record.actions && meta.remote_record.actions.indexOf("pull") != -1){
                return 'synchronise'
            }
        }
        else {
            if(meta.type == 'local_clone'){
                return 'synchronise'
            }
            return false
        }
    }
    else {
        if(user.logged_in){
            return 'share'
        }
    }
}
