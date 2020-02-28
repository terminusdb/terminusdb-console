import React from "react";

const Footer = () => (
	<footer className="footer fstack">
		<div className="wrapper wrapper--increased">
			<div className="footer__body">
				<a href="https://terminusdb.com" className="footer__brand" role="button">
					<img src="img/logos/logo.svg" className="footer__logo" alt="Terminus DB logo" ></img>
				</a>
				<ul className="footer__list">
					<li className="footer__item">
						<a href="https://terminusdb.com/docs/" target="_blank" className="footer__link" aria-label="Documentation">
							Documentation
						</a>
					</li>
					<li className="footer__item">
						<a href="https://medium.com/terminusdb" target="_blank" className="footer__link" aria-label="Blog">
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
	</footer>
);

export default Footer;
