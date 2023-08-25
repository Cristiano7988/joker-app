
# Branches:

`JOKER-1`: Creation of pages for public access based in the Pages Collection;\
`JOKER-2`: Creation of pages for public access based in Templates Collection. Templates collection supports components and props that can be passed to those components;\
`JOKER-3`: Same as before. Templates collection supports modules and props that can be passed to those modules, besides that each module can query for content in other collections, can filter it, read (or to manipulate) the results in a callback function and update the content in the content field for each result of the query;\
`JOKER-4`: Same as before. For Templates whose sufix of its slug is equal to "-details" the page will load with the content of the Collection whose the name is equal to the prefix of the root of the nested route; (i.e.: "/blog-details/{nested-route}", the Template "blog-details" will load the item whose slug is equal to {nested-route} of the collection Blog); \
`JOKER-5`: Same as before. This branch's update handles the form submit who creates, updates and gets the content of a given collection. It suports the creation of forms (to be improved) based in the Forms collection, also this collection supports a filter option (To be improved).
