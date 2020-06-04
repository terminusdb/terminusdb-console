import React, { useState, useEffect } from "react";
//import WOQLQueryContainer from "../components/WOQLQueryContainer";
import * as q from "../../labels/queryLabels";
import { WOQLTable } from '@terminusdb/terminusdb-react-table';

import TerminusClient from '@terminusdb/terminusdb-client';
//import {ResultViewer} from  "../components/QueryPane/ResultViewer"
import {WOQLQueryContainerHook} from "../../components/WOQLQueryContainerHook";
//const WOQLQueryContainer = ({query=false,children}) => {

import {QueryLibrary} from "../../components/QueryPane/QueryLibrary"

import TestResult from "./TestResult";


/*
* this is load ones 
*/
const TestHome = (props) => {
 	const query= TerminusClient.WOQL.star();

    //const [setWoql,setCommitMsg,report,bindings] = WOQLQueryContainerHook(query);
    const [updateQuery, report, bindings, woql] = WOQLQueryContainerHook(query);
  
      const bindingsMy= [
  {
    "Object": "terminus:///terminus/document/server_access",
    "Predicate": "http://terminusdb.com/schema/terminus#access",
    "Subject": "terminus:///terminus/document/access_all_areas"
  },
  {
    "Object": "http://terminusdb.com/schema/terminus#ServerCapability",
    "Predicate": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
    "Subject": "terminus:///terminus/document/access_all_areas"
  },
  {
    "Object": {
      "@language": "en",
      "@value": "Access all server functions"
    },
    "Predicate": "http://www.w3.org/2000/01/rdf-schema#comment",
    "Subject": "terminus:///terminus/document/access_all_areas"
  },
  {
    "Object": {
      "@language": "en",
      "@value": "All Capabilities"
    },
    "Predicate": "http://www.w3.org/2000/01/rdf-schema#label",
    "Subject": "terminus:///terminus/document/access_all_areas"
  },
  {
    "Object": {
      "@type": "http://www.w3.org/2001/XMLSchema#string",
      "@value": "$pbkdf2-sha512$t=32768$iopgGUgvS97NZ9PvU/jvbw$ZKGqjYnVR5ev9r2DLK/aa02fgfecHSyUNKY9GEzggvRfzTEaB5PYoZZfeP+aWbDaHddcE8DwXL1/2iAo7Nt7Tw"
    },
    "Predicate": "http://terminusdb.com/schema/terminus#agent_key_hash",
    "Subject": "terminus:///terminus/document/admin"
  },
  {
    "Object": {
      "@type": "http://www.w3.org/2001/XMLSchema#string",
      "@value": "admin"
    },
    "Predicate": "http://terminusdb.com/schema/terminus#agent_name",
    "Subject": "terminus:///terminus/document/admin"
  },
  {
    "Object": "terminus:///terminus/document/access_all_areas",
    "Predicate": "http://terminusdb.com/schema/terminus#authority",
    "Subject": "terminus:///terminus/document/admin"
  },
  {
    "Object": "http://terminusdb.com/schema/terminus#User",
    "Predicate": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
    "Subject": "terminus:///terminus/document/admin"
  },
  {
    "Object": {
      "@language": "en",
      "@value": "This is the server super user account"
    },
    "Predicate": "http://www.w3.org/2000/01/rdf-schema#comment",
    "Subject": "terminus:///terminus/document/admin"
  },
  {
    "Object": {
      "@language": "en",
      "@value": "Server Admin User"
    },
    "Predicate": "http://www.w3.org/2000/01/rdf-schema#label",
    "Subject": "terminus:///terminus/document/admin"
  },
  {
    "Object": {
      "@type": "http://www.w3.org/2001/XMLSchema#string",
      "@value": "*"
    },
    "Predicate": "http://terminusdb.com/schema/terminus#allow_origin",
    "Subject": "terminus:///terminus/document/server"
  },
  {
    "Object": "terminus:///terminus/document/terminus",
    "Predicate": "http://terminusdb.com/schema/terminus#resource_includes",
    "Subject": "terminus:///terminus/document/server"
  },
  {
    "Object": {
      "@type": "http://www.w3.org/2001/XMLSchema#string",
      "@value": "http://localhost:6363"
    },
    "Predicate": "http://terminusdb.com/schema/terminus#resource_name",
    "Subject": "terminus:///terminus/document/server"
  },
  {
    "Object": "http://terminusdb.com/schema/terminus#Server",
    "Predicate": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
    "Subject": "terminus:///terminus/document/server"
  },
  {
    "Object": {
      "@language": "en",
      "@value": "The current Database Server itself"
    },
    "Predicate": "http://www.w3.org/2000/01/rdf-schema#comment",
    "Subject": "terminus:///terminus/document/server"
  },
  {
    "Object": {
      "@language": "en",
      "@value": "The DB server"
    },
    "Predicate": "http://www.w3.org/2000/01/rdf-schema#label",
    "Subject": "terminus:///terminus/document/server"
  },
  {
    "Object": "http://terminusdb.com/schema/terminus#branch",
    "Predicate": "http://terminusdb.com/schema/terminus#action",
    "Subject": "terminus:///terminus/document/server_access"
  },
  {
    "Object": "http://terminusdb.com/schema/terminus#class_frame",
    "Predicate": "http://terminusdb.com/schema/terminus#action",
    "Subject": "terminus:///terminus/document/server_access"
  },
  {
    "Object": "http://terminusdb.com/schema/terminus#clone",
    "Predicate": "http://terminusdb.com/schema/terminus#action",
    "Subject": "terminus:///terminus/document/server_access"
  },
  {
    "Object": "http://terminusdb.com/schema/terminus#commit_read_access",
    "Predicate": "http://terminusdb.com/schema/terminus#action",
    "Subject": "terminus:///terminus/document/server_access"
  },
  {
    "Object": "http://terminusdb.com/schema/terminus#commit_write_access",
    "Predicate": "http://terminusdb.com/schema/terminus#action",
    "Subject": "terminus:///terminus/document/server_access"
  },
  {
    "Object": "http://terminusdb.com/schema/terminus#create_database",
    "Predicate": "http://terminusdb.com/schema/terminus#action",
    "Subject": "terminus:///terminus/document/server_access"
  },
  {
    "Object": "http://terminusdb.com/schema/terminus#delete_database",
    "Predicate": "http://terminusdb.com/schema/terminus#action",
    "Subject": "terminus:///terminus/document/server_access"
  },
  {
    "Object": "http://terminusdb.com/schema/terminus#fetch",
    "Predicate": "http://terminusdb.com/schema/terminus#action",
    "Subject": "terminus:///terminus/document/server_access"
  },
  {
    "Object": "http://terminusdb.com/schema/terminus#inference_read_access",
    "Predicate": "http://terminusdb.com/schema/terminus#action",
    "Subject": "terminus:///terminus/document/server_access"
  },
  {
    "Object": "http://terminusdb.com/schema/terminus#inference_write_access",
    "Predicate": "http://terminusdb.com/schema/terminus#action",
    "Subject": "terminus:///terminus/document/server_access"
  },
  {
    "Object": "http://terminusdb.com/schema/terminus#instance_read_access",
    "Predicate": "http://terminusdb.com/schema/terminus#action",
    "Subject": "terminus:///terminus/document/server_access"
  },
  {
    "Object": "http://terminusdb.com/schema/terminus#instance_write_access",
    "Predicate": "http://terminusdb.com/schema/terminus#action",
    "Subject": "terminus:///terminus/document/server_access"
  },
  {
    "Object": "http://terminusdb.com/schema/terminus#manage",
    "Predicate": "http://terminusdb.com/schema/terminus#action",
    "Subject": "terminus:///terminus/document/server_access"
  },
  {
    "Object": "http://terminusdb.com/schema/terminus#meta_read_access",
    "Predicate": "http://terminusdb.com/schema/terminus#action",
    "Subject": "terminus:///terminus/document/server_access"
  },
  {
    "Object": "http://terminusdb.com/schema/terminus#meta_write_access",
    "Predicate": "http://terminusdb.com/schema/terminus#action",
    "Subject": "terminus:///terminus/document/server_access"
  },
  {
    "Object": "http://terminusdb.com/schema/terminus#push",
    "Predicate": "http://terminusdb.com/schema/terminus#action",
    "Subject": "terminus:///terminus/document/server_access"
  },
  {
    "Object": "http://terminusdb.com/schema/terminus#rebase",
    "Predicate": "http://terminusdb.com/schema/terminus#action",
    "Subject": "terminus:///terminus/document/server_access"
  },
  {
    "Object": "http://terminusdb.com/schema/terminus#schema_read_access",
    "Predicate": "http://terminusdb.com/schema/terminus#action",
    "Subject": "terminus:///terminus/document/server_access"
  },
  {
    "Object": "http://terminusdb.com/schema/terminus#schema_write_access",
    "Predicate": "http://terminusdb.com/schema/terminus#action",
    "Subject": "terminus:///terminus/document/server_access"
  },
  {
    "Object": "terminus:///terminus/document/server",
    "Predicate": "http://terminusdb.com/schema/terminus#authority_scope",
    "Subject": "terminus:///terminus/document/server_access"
  },
  {
    "Object": "http://terminusdb.com/schema/terminus#Access",
    "Predicate": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
    "Subject": "terminus:///terminus/document/server_access"
  },
  {
    "Object": {
      "@language": "en",
      "@value": "Server wide access Object"
    },
    "Predicate": "http://www.w3.org/2000/01/rdf-schema#comment",
    "Subject": "terminus:///terminus/document/server_access"
  },
  {
    "Object": {
      "@language": "en",
      "@value": "server access"
    },
    "Predicate": "http://www.w3.org/2000/01/rdf-schema#label",
    "Subject": "terminus:///terminus/document/server_access"
  },
  {
    "Object": {
      "@type": "http://www.w3.org/2001/XMLSchema#string",
      "@value": "*"
    },
    "Predicate": "http://terminusdb.com/schema/terminus#allow_origin",
    "Subject": "terminus:///terminus/document/terminus"
  },
  {
    "Object": {
      "@type": "http://www.w3.org/2001/XMLSchema#string",
      "@value": "terminus"
    },
    "Predicate": "http://terminusdb.com/schema/terminus#resource_name",
    "Subject": "terminus:///terminus/document/terminus"
  },
  {
    "Object": "http://terminusdb.com/schema/terminus#Database",
    "Predicate": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
    "Subject": "terminus:///terminus/document/terminus"
  },
  {
    "Object": {
      "@language": "en",
      "@value": "The master database contains the meta-data about databases, users and roles"
    },
    "Predicate": "http://www.w3.org/2000/01/rdf-schema#comment",
    "Subject": "terminus:///terminus/document/terminus"
  },
  {
    "Object": {
      "@language": "en",
      "@value": "Master Database"
    },
    "Predicate": "http://www.w3.org/2000/01/rdf-schema#label",
    "Subject": "terminus:///terminus/document/terminus"
  },
  {
    "Object": "terminus:///terminus/document/terminus",
    "Predicate": "http://terminusdb.com/schema/terminus#authority_scope",
    "Subject": "terminus:///terminus/document/server_access"
  }
]

    const libs=[q.SHOW_ALL_SCHEMA_ELEMENTS,
                q.SHOW_ALL_CLASSES,
                q.SHOW_ALL_PROPERTIES,
                q.SHOW_DOCUMENT_CLASSES]

	return (<div>hello
             <WOQLTable bindings={bindingsMy} />
			 <QueryLibrary libs={libs} setWoql={updateQuery}/>
			 <TestResult bindings={bindings} />
			</div>
	)
}


export default TestHome;