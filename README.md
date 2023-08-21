
# Branches:

## That supports the creation of pages for public access:

`JOKER-1`: Based in the Pages Collection;\
`JOKER-2`: Based in Templates Collection. Templates collection supports components and props that can be passed to those components;\
`JOKER-3`: Same as before. Templates collection supports modules and props that can be passed to those modules, besides that each module can query for content in other collections, can filter it, read (or to manipulate) the results in a callback function and update the content in the content field for each result of the query;\
`JOKER-4`: Same as before. For Templates whose sufix of its slug is equal to "-details" the page will load with the content of the Collection whose the name is equal to the prefix of the root of the nested route; (i.e.: "/blog-details/{nested-route}", the Template "blog-details" will load the item whose slug is equal to {nested-route} of the collection Blog);\
