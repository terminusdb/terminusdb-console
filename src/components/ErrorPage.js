import React from "react";
import { DialogueBox } from "./DialogueBox"

const ErrorPage = () => (
	<DialogueBox message = { "TerminusDB Server can not be found." }
		header = { 'Oops...!' }/>
);

export default ErrorPage;
