
import React, { useState, useEffect } from 'react';
import { Button, Collapse, CardBody, Card, CardHeader, Col, Row } from 'reactstrap';
import {useForm} from 'react-hook-form'
import { AiFillCaretUp, AiFillCaretDown } from 'react-icons/ai'
import {SendEmailHook} from  "../../init/SendEmailHook"
import { useAuth0 } from "../../react-auth0-spa";

export const FeedbackForm = (props) => {

	const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();
	const {register, handleSubmit, errors,reset} = useForm()
	const {emailResult, emailError, sendEmailData}=SendEmailHook(reset)

    const userName= user ? user['http://terminusdb.com/schema/system#agent_name'] : false;

	const onSubmit=(data)=>{
		data['username']=userName;
		if(user){
			data['email']=user.email

		}
		sendEmailData(data);
	}


	return (<>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div key="rr" className="feedback-section">
                        {userName && <><h3 class="h3 box__text">Hi {userName}</h3>
                            <div className="feedback-text">If you notice any bugs or have any suggestions about how we can improve the service, please let us know</div>
                        </>}
						
					</div>
					<img className="feedback-icon" src="https://assets.terminusdb.com/terminusdb-console/images/Mascot-Color-Tight.png"/>
					{!userName && <div className="feedback-section">
						<label>Email</label>
						<input type="email"
						  placeholder='Enter your Email'
						  name="email"
						  className = "tcf-input"
						  ref={register({
							validate: (value) => value.length > 0
						  })}
					   />
					</div>}
					<div className="feedback-section">
						<label>Message</label>
						<textarea
						  placeholder='Enter Feedback'
						  name="message"
						  className = "tcf-textarea"
						  ref={register({
							validate: (value) => value.length > 0
						  })}
						/>
					</div>
					<div className="feedback-section">
						{emailResult && <div className="feedback-alert alert alert-success">Your message was succesfully submitted</div>}
						{emailError &&  <div className="feedback-alert alert alert-danger">Error: there was a problem sending your message</div>}
					</div>
					<div className="feedback-button">          
						<button type="submit" className="tdb__button__base tdb__button__base--green tdb__commit__bar--button">Send
						</button>
                        <button onClick={props.toggle} className="tdb__button__base tdb__button__base--gray tdb__commit__bar--button">
                            Cancel
                        </button>
					</div>
				</form>
    </>)

	/*return (<>
		{/*!showFeedback &&
			<Card className="feedbackCardButton feedbackCard" onClick={() => setIsOpen(true)} >
				<CardHeader className="feedback-card-header">
					Feedback
					<AiFillCaretUp className="feedbackButtonIcon"/>
				</CardHeader>
			</Card>
		}
		{
			<div>
			    <Card className="feedbackCard">
			      	<CardHeader className="feedback-card-header" onClick={() => setIsOpen(false)}>
						Feedback
						<AiFillCaretDown className="feedbackButtonIcon"/>
					</CardHeader>
			      	<CardBody>
					    <form onSubmit={handleSubmit(onSubmit)}>
							<div key="rr" className="feedback-section">
								<div className="feedback-text">Please use this form to provide feedback about our service</div>
							</div>
							<img className="feedback-icon" src="https://assets.terminusdb.com/terminusdb-console/images/Mascot-Color.png"/>
							<div className="feedback-section">
								<label>Email</label>
						    	<input type="email"
								  placeholder='Enter your Email'
								  name="email"
								  className = "tcf-input"
								  ref={register({
									validate: (value) => value.length > 0
								  })}
							   />
							</div>
							<div className="feedback-section">
								<label>Message</label>
							    <textarea
								  placeholder='Enter Feedback'
								  name="message"
								  className = "tcf-textarea"
								  ref={register({
									validate: (value) => value.length > 0
								  })}
							    />
							</div>
						    <div className="feedback-button">
							    <button type="submit" className="tdb__button__base tdb__button__base--green tdb__commit__bar--button">Send
							    </button>
						    </div>
			            </form>
			      </CardBody>
			    </Card>
			</div>
		}
		</>
	) */
}
