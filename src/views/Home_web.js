import React, { Fragment } from "react";
import { NavLink as RouterNavLink } from "react-router-dom";

import Hero from "../components/Hero";
import Content from "../components/Content";
import HomeNavBar from "../components/HomeNavBar";
import SlickCard from "../components/SlickCard";

import { useAuth0 } from "../react-auth0-spa";

const Home = () => {

 	const {isAuthenticated, loginWithRedirect } = useAuth0();

	return (<Fragment>
				<HomeNavBar/>
				<div className="large-banner">
					<div className="wrapper">
						<picture className="large-banner__image">
							<source srcset="img/banner/banner-shapes.png" media="(min-width: 1000px)"></source>
							<source srcset="img/banner/banner-shapes.png" media="(min-width: 760px)"></source>
							<img srcset="img/banner/banner-shapes-mobile.png" alt="banner image" />
						</picture>
						<div className="large-banner__container">
							<ul className="large-banner__social-list">
								<li className="large-banner__social-item">
									<a href="https://twitter.com/TerminusDB" className="large-banner__social-link" target="_blank">
										<i className="icon-twitter large-banner__icon"></i>
									</a>
								</li>
								<li className="large-banner__social-item">
									<a href="https://github.com/terminusdb/terminus-server" className="large-banner__social-link" target="_blank">
										<i className="icon-github-logo large-banner__icon"></i>
									</a>
								</li>
							</ul>
							<h1 className="h1 large-banner__title large-banner__title--light">
								A database for data people
							</h1>
							<p className="large-banner__text large-banner__text--light">
								Structured, semantically meaningful data for rapid delivery of data driven applications. Join the data-centric revolution!
							</p>
							{!isAuthenticated && (               
              					<a href="#" id="qsLoginBtn" onClick={() => loginWithRedirect({})} className="large-banner__button" ariaLabel="Download now">
                					Download now
             					</a>
            				)}
							{isAuthenticated && (
								<RouterNavLink
	                    				to="/download"
	                    				className="large-banner__button"
	                 				 >
	                    			Download now
	                 			</RouterNavLink>
                 			)}
						</div>
					</div>
				</div>

				<div className="page-strip page-strip--light page-strip--reduced-top-padding page-strip--reduced-bottom-padding-mobile">
					<div className="wrapper">
						<div className="fifty-fifty">
							<div className="fifty-fifty__child">
								<div className="box box--collapsed box--with-shadow">
									<h3 className="h3 box__title">
										What is TerminusDB?
									</h3>
									<p className="box__text">
										TerminusDB is a database built for data people. Terminus is a model driven graph database designed specifically for the web-age.
									</p>
									<p className="box__text">
										The result is unified, well-structured & refined data  - the jet fuel of future business. TerminusDB greatly reduces the time and effort required to build any application that shares, manipulates or edits data.
									</p>
									{!isAuthenticated && (               
		              					<a href="#" id="qsLoginBtn" onClick={() => loginWithRedirect({})} className="large-banner__button" ariaLabel="Download now">
		                					Download now
		             					</a>
            							)}
									{isAuthenticated && (
										<RouterNavLink
		                    				to="/download"
		                    				className="large-banner__button">
	                    				Download now
	                 					</RouterNavLink>
                 					)}
								</div>
							</div>
							<div className="fifty-fifty__child">
								<div className="box box--with-background">
									<div className="box__background-image" style={{backgroundImage: "url('img/placeholders/img-1.png')"}}>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="page-strip page-strip--light page-strip--reduced-top-padding-mobile">
					<div className="wrapper">
						<div className="page-strip__title-container">
							<h2 className="h2 page-strip__title">
								TerminusDB: The Difference
							</h2>
						</div>
						<div className="table-container">
							<table className="table tablesaw tablesaw-stack" data-tablesaw-mode="stack">
								<thead className="table__head">
									<tr className="table__row">
										<th className="table__th table__th--hidden-mobile" scope="col"></th>
										<th className="table__th" scope="col">
											<img src="img/logos/table-logo-1.svg"
											     alt="" />
										</th>
										<th className="table__th" scope="col">
											<img src="img/logos/table-logo-2.svg"
											     alt="" />
										</th>
										<th className="table__th" scope="col">
											<img src="img/logos/table-logo-3.svg"
											     alt="" />
										</th>
										<th className="table__th" scope="col">
											<img src="img/logos/table-logo-4.svg"
											     alt="" />
										</th>
										<th className="table__th" scope="col">
											<img src="img/logos/table-logo-5.svg"
											     alt="" />
										</th>
										<th className="table__th" scope="col">
											<img src="img/logos/table-logo-6.svg"
											     alt="" />
										</th>
									</tr>
								</thead>
								<tbody>
									<tr className="table__row">
										<td className="table__cell table__text">Web/ Cloud Native</td>
										<td className="table__cell"><i className="icon-tick table__icon table__icon--primary"></i></td>
										<td className="table__cell"><i className="icon-minus table__icon table__icon--alt table__icon--small"></i></td>
										<td className="table__cell"><i className="icon-minus table__icon table__icon--alt table__icon--small"></i></td>
										<td className="table__cell"><i className="icon-minus table__icon table__icon--alt table__icon--small"></i></td>
										<td className="table__cell"><i className="icon-x table__icon table__icon--big"></i></td>
										<td className="table__cell"><i className="icon-x table__icon table__icon--big"></i></td>
									</tr>
									<tr className="table__row">
										<td className="table__cell table__text">Schematic Quality Control</td>
										<td className="table__cell"><i className="icon-tick table__icon table__icon--primary"></i></td>
										<td className="table__cell"><i className="icon-tick table__icon table__icon--primary"></i></td>
										<td className="table__cell"><i className="icon-x table__icon table__icon--big"></i></td>
										<td className="table__cell"><i className="icon-x table__icon table__icon--big"></i></td>
										<td className="table__cell"><i className="icon-minus table__icon table__icon--alt table__icon--small"></i></td>
										<td className="table__cell"><i className="icon-x table__icon table__icon--big"></i></td>
									</tr>
									<tr className="table__row">
										<td className="table__cell table__text">Geo-Temporal Query</td>
										<td className="table__cell"><i className="icon-tick table__icon table__icon--primary"></i></td>
										<td className="table__cell"><i className="icon-x table__icon table__icon--big"></i></td>
										<td className="table__cell"><i className="icon-x table__icon table__icon--big"></i></td>
										<td className="table__cell"><i className="icon-x table__icon table__icon--big"></i></td>
										<td className="table__cell"><i className="icon-minus table__icon table__icon--alt table__icon--small"></i></td>
										<td className="table__cell"><i className="icon-tick table__icon table__icon--primary"></i></td>
									</tr>
									<tr className="table__row">
										<td className="table__cell table__text">AI Code Generation</td>
										<td className="table__cell"><i className="icon-tick table__icon table__icon--primary"></i></td>
										<td className="table__cell"><i className="icon-x table__icon table__icon--big"></i></td>
										<td className="table__cell"><i className="icon-x table__icon table__icon--big"></i></td>
										<td className="table__cell"><i className="icon-x table__icon table__icon--big"></i></td>
										<td className="table__cell"><i className="icon-x table__icon table__icon--big"></i></td>
										<td className="table__cell"><i className="icon-x table__icon table__icon--big"></i></td>
									</tr>
									<tr className="table__row">
										<td className="table__cell table__text">ACID</td>
										<td className="table__cell"><i className="icon-tick table__icon table__icon--primary"></i></td>
										<td className="table__cell"><i className="icon-minus table__icon table__icon--alt table__icon--small"></i></td>
										<td className="table__cell"><i className="icon-minus table__icon table__icon--alt table__icon--small"></i></td>
										<td className="table__cell"><i className="icon-x table__icon table__icon--big"></i></td>
										<td className="table__cell"><i className="icon-tick table__icon table__icon--primary"></i></td>
										<td className="table__cell"><i className="icon-tick table__icon table__icon--primary"></i></td>
									</tr>
									<tr className="table__row">
										<td className="table__cell table__text">Auto-Sharding</td>
										<td className="table__cell"><i className="icon-x table__icon table__icon--big"></i></td>
										<td className="table__cell"><i className="icon-x table__icon table__icon--big"></i></td>
										<td className="table__cell"><i className="icon-x table__icon table__icon--big"></i></td>
										<td className="table__cell"><i className="icon-tick table__icon table__icon--primary"></i></td>
										<td className="table__cell"><i className="icon-tick table__icon table__icon--primary"></i></td>
										<td className="table__cell"><i className="icon-x table__icon table__icon--big"></i></td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
				<SlickCard />
				<div className="page-strip page-strip--with-background page-strip--normal-top-padding page-strip--extended-bottom-padding">
					<div className="wrapper">
						<div className="fifty-fifty">
							<div className="fifty-fifty__child">
							</div>
							<div className="fifty-fifty__child">
								<h2 className="h2 page-strip__title page-strip__title--white page-strip__title--big-mobile page-strip__title--big-margin-bottom">
									Data As A First Class Citizen
								</h2>
								<p className="page-strip__text page-strip__text--white">
									We believe it is time for data to take its rightful place as a first class citizen in the IT ecosystem. We believe in intelligent, semantic data stores as the foundation blocks of an almost infinite number of data solutions, rather than code-driven proprietary solutions that are almost impossible to extend and adapt. Hoarding data in proprietary and complex applications is a mistake. Validation logic should be embedded in the data layer where it belongs and not housed in ephemeral and expensive to maintain application code.
								</p>
								<p className="page-strip__text page-strip__text--white">
									TerminusDB is about taking data seriously, structuring data to meet business needs, and reducing the code required to display, distribute and manipulate data and support great decision making.
								</p>
								<a href="https://github.com/terminusdb/terminus-server" target="_blank" className="button button--primary" aria-label="Download now">
									Download now
								</a>
							</div>
						</div>
					</div>
				</div>
			 </Fragment>)
}

export default Home;

/*
<header className="header">
	<div className="wrapper">
		<nav className="menu">
			<a href="https://terminusdb.com" className="menu__brand" role="button">
				<img src="img/logos/logo.svg" className="menu__logo" alt="Terminus DB logo"></img>
			</a>
			<div className="menu__body">
				<ul className="menu__list">
					<li className="menu__item">
						<a href="https://terminusdb.com/docs/" target="_blank" className="menu__link" aria-label="Documentation">
							Documentation
						</a>
					</li>
					<li className="menu__item">
						<a href="https://medium.com/terminusdb" target="_blank" className="menu__link" aria-label="Blog">
							Blog
						</a>
					</li>
					<li className="menu__item menu__item--full-mobile">
						<ul className="menu__social-list">
							<li className="menu__social-item">
								<a href="https://twitter.com/TerminusDB" className="menu__social-link" target="_blank">
									<i className="icon-twitter menu__icon"></i>
								</a>
							</li>
							<li className="menu__social-item">
								<a href="https://github.com/terminusdb/terminus-server" className="menu__social-link" target="_blank">
									<i className="icon-github-logo menu__icon"></i>
								</a>
							</li>
						</ul>
					</li>
					<li className="menu__item menu__item--full-mobile">
						<a href="https://github.com/terminusdb/terminus-server" target="_blank" className="menu__button" aria-label="Download now">
							Download now
						</a>
					</li>
				</ul>
				<ul className="menu__footer">
					<li className="menu__secondary-item">
						<a href="https://terminusdb.com" role="button">
							<img src="img/logos/logo.svg" className="menu__secondary-logo" alt="Terminus DB logo"></img>
						</a>
					</li>
					<li className="menu__secondary-item">
						<p className="menu__copyright">
							{"&copy;2020 - TerminusDB | All right reserved"}
						</p>
					</li>
				</ul>
			</div>
			<button id="burger" className="menu__burger" role="button" aria-label="Navigation burger button">
				<span></span>
				<span></span>
				<span></span>
			</button>
		</nav>
	</div>
</header>
*/