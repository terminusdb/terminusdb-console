# Components Directory

Components are either 

1. Self-contained components that can be used in multiple places (HistoryNavigator, QueryPane, Reports) - which will eventually be part of external libraries
2. Functional components that take care of a specific task (Router, Navbar, Query) across the site
3. Generic Generators that are used in many places (Form, Table)

Components are distinguished form views in that components appear within views but never vice versa

Views are more concerned with layout and orchestration while components are more focused on function

As always, there is no perfect dividing line, but components should be more generic and views should be more particular
