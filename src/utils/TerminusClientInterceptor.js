import TerminusClient from '@terminusdb/terminusdb-client';/*
* we can add the Auth0 token here
*/
TerminusClient.axiosInstance.interceptors.request.use(function (config) {
    // Do something before request is sent
    config.metadata = { startTime: new Date()}	
    
 	
    return config;
  }, function (error) {
     
     return Promise.reject(error);
  });

TerminusClient.axiosInstance.interceptors.response.use(function (response) {
  /*
  * only if we have a bindings result
  */
  if(response && response.data && response.data.bindings){
  		const data = response.data || {};
  		data.metadata={};
  		data.metadata.start = response.config.metadata.startTime
  		data.metadata.end = new Date()
  		data.metadata.duration =  data.metadata.end  - response.config.metadata.startTime
 		
 		data.metadata.inserts= data.inserts, 
        data.metadata.deletes= data.deletes,
  		data.metadata.rows=response.data.bindings.length;
  		data.metadata.columns=response.data.bindings[0].length;
  		data.metadata.transaction_retry_count= response.data.transaction_retry_count
  		response.data=data;
  }
 
  return response;
}, function (error) {
	/*I have check better the error*/
  	//error.config.metadata.end = new Date();
  	//error.config.metadata.duration = error.config.metadata.endTime - error.config.metadata.startTime;
  return Promise.reject(error);
});