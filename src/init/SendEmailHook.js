import { useState, useEffect } from "react";
import   axios  from "axios" ;

function SendEmailHook(resetForm) {

	//create database
	const axiosHub=axios.create();
	const [emailResult, sendEmailResult] = useState(false)
	const [emailData, sendEmailData] = useState(null)
    const [loadingEmail, setEmailLoading] = useState(false)
    const [emailError,setEmailError]=useState(false)
   // const [reloadDataP, setReloadDataP] = useState(true)

    /*
    * link to the node server
    */

	const bff_url=process.env.TERMINUS_BFF_URL;
	const baseUrl=`${bff_url}api`

    const options = {
		mode: 'cors', // no-cors, cors, *same-origin
		redirect: 'follow', // manual, *follow, error
		referrer: 'client',
	};
	useEffect(() => {
		 async function callEmailServer() {
		 	try{
		 		setEmailLoading(true)
		 		setEmailError(false)
		 		sendEmailResult(false)

                const result = await axiosHub.post(`${baseUrl}/email`, emailData , options)
                resetForm()
                sendEmailResult(result);
			}catch(err){
				console.error(err);
				setEmailError(true)
			}finally{
				setEmailLoading(false)
			}
		 }
//REACT_APP_BASE_URL
		if(emailData!==null){
	     	callEmailServer();
		}
    }, [emailData]);




    return {emailResult,emailError,sendEmailData};
}

export { SendEmailHook };
