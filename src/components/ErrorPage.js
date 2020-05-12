import React from "react";
import { DialogueBox } from "./Reports/DialogueBox"

const ErrorPage = () => (
	<DialogueBox message = { "TerminusDB Server can not be found" }
		header = { 'Oops...!' }/>
);

export default ErrorPage;
