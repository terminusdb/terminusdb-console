# Query Tools

Component which gathers together the WOQL query related generic tools that we use

1. TerminusClientInterceptor - intercepts axios calls and amends them
1. WOQLQueryContainer - wrap
1. WOQLQueryContainerHook - produces a convenient [updateQuery, report, bindings, woql] return for a given query
1. MetadataLoader - user friendly loading of commonly used structural metadata gathered into one place
