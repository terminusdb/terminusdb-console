import {useState, useEffect} from 'react'
import axios from 'axios'
import {useAuth0} from '../../react-auth0-spa'
import {WOQLClientObj} from '../../init/woql-client-instance'

export const CREATE_DB_END_POINT = 'db'
export const UPDATE_CAPABILITIES_END_POINT = 'capabilities'

const axiosHub = axios.create()
const baseUrl = process.env.TERMINUSDB_HUB_BASE_URL || ''

const dbJson = {
    dbid: req.body.dbid,
    label: req.body.label,
    comment: req.body.comment,
    ispublic: req.body.ispublic,
}

//remoteServer
const hubServerCall = (url, payload, getTokenSilently) => {
    /*
     * return the headers or throw an error
     */
    const getHeader = async () => {
        const options = {
            mode: 'cors', // no-cors, cors, *same-origin
            redirect: 'follow', // manual, *follow, error
            referrer: 'client',
        }
        const token = await getTokenSilently()
        options.headers = {Authorization: `Bearer ${token}`}
        return options
    }

    /*
     * return the dataprovider or throw an error
     */
    const postCall = async () => {
        const options = await getHeader()
        const result = await axiosHub.post(`${baseUrl}/${url}`, payload, options)
        return result
    }

    /*
     * for get information about a specific db /db/dbname
     * for get capabilities /capabilities
     */
    const getCall = async () => {
        const options = await getHeader()
        const result = await axiosHub.get(`${baseUrl}/${url}`, options)
    }
}

function CallServerHook() {
    //create database

    const {user, isAuthenticated, getTokenSilently} = useAuth0()
    const [dataProvider, setDataprovider] = useState([])
    const [loadingProfile, setLoading] = useState(true)
    const [profileError, setError] = useState(true)
    const {woqlClient} = WOQLClientObj()


    const options = {
        mode: 'cors', // no-cors, cors, *same-origin
        redirect: 'follow', // manual, *follow, error
        referrer: 'client',
    }

    

    //create db and updatecapabilities
    useEffect(() => {
        async function callHubServer() {
            if(woqlClient){
                let url = `${baseUrl}/profile?console=${encodeURIComponent(woqlClient.server())}`
                try {
                    setLoading(true)
                    const token = await getTokenSilently()
                    options.headers = {Authorization: `Bearer ${token}`}

                    const result = await axiosHub.get(url, options)

                    setDataprovider(result)
                    setLoading(false)
                } catch (err) {
                    setError(err)
                    console.error(err)
                }
            }
        }
        //REACT_APP_BASE_URL
        callHubServer()
    }, [])

    return [dataProvider, loadingProfile, profileError]
}

export {CallServerHook}

/*async function test(){
			const accessToken = await getTokenSilently();
  			console.log("____TOKEN____",accessToken);
  			console.log()

  			const result = await fetch('http://localhost:8080/user_management', {
		    	method: 'POST',
		    	headers: {
		    	Authorization: 'Bearer ' + accessToken
		    	//ApiKey : `${accessToken}`
		      	//apikey: claims.__raw
		    	}
		  	});
		  	const data = await result.json();
		  	console.log(data);
		
		}

		test();
    }

	const testServer=(evt)=>{
		async function test(){
  			const accessToken = await getTokenSilently();
  			console.log("____TOKEN____",accessToken);

  			const result = await fetch('/secure', {
		    	method: 'POST',
		    	headers: {
		    	Authorization : `Bearer ${accessToken}`
		    	//ApiKey : `${accessToken}`
		      	//apikey: claims.__raw
		    	}
		  	});
		  	const data = await result.json();
		  	console.log(data);
		
		}

		test();
		//test01();
    }

	const testServer01=(evt)=>{

		async function test(){
  			const accessToken = await getTokenSilently();
  			console.log("____TOKEN____",accessToken);

  			const result = await fetch('http://localhost:4250/api/private', {
		    	method: 'GET',
		    	headers: {
		      	Authorization: 'Bearer ' + accessToken
		    	}
		  	});
		  	//const data = await result.json();
		  	//console.log(data);
		
		}

		test();
    }

	const testServer02=(evt)=>{

		fetch('http://localhost:3010/api/public')
		  .then((response) => {
		    return response.json();
		  })
		  .then((data) => {
		    console.log(data);
		  });

	}

*/
