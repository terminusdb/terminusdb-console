import React from "react";

export const Footer = (props) => {
	return (<footer className="footer fstack">
		<div className="wrapper wrapper--increased">
			<div className="footer__body">
				<a href="https://terminusdb.com" className="footer__brand" role="button">
					<img src="https://terminusdb.com/img/logos/logo.svg" className="footer__logo" alt="Terminus DB logo" ></img>
				</a>
				<ul className="footer__list">
					<li className="footer__item">
						<a href="https://terminusdb.com/documentation/" target="_blank" className="footer__link" aria-label="Documentation">
							Documentation
						</a>
					</li>
					<li className="footer__item">
						<a href="https://terminusdb.com/blog" target="_blank" className="footer__link" aria-label="Blog">
							Blog
						</a>
					</li>
					<li className="footer__item">
						<p className="footer__copyright">&copy;2020 - TerminusDB | All right reserved
						</p>
					</li>
				</ul>
			</div>
		</div>
	</footer>)
}