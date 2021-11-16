
# The GameShed API

## Project Summary 

This API allows users to access game reviews, comments and categories. On each of these tables you can GET the data in JSON format. 
To see exactly what you can do, click [here](https://james-boardgames.herokuapp.com/api/)

---


### Hosting it yourself? 
### To clone the repo, please follow this [link](https://github.com/jamwil123/be-nc-games.git). 


To install the dependencies on the project run the command below in your terminal
 ```
npm i
```
To seed the database on the project please run the command below in your terminal

```
npm run seed 
```

To run tests ensure jest is installed and then run the following command in your terminal bellow

```
npm test 
```

## .env files 

please ensure you create two .env files inside the main directory. One named 

```
.env.development
```
and contain
```
PGDATABASE=nc_games
```
and the second one should be named 

```
.env.test
```
and contain
```
PGDATABASE=nc_game_test
```
## Minimum dependencies versions

Please ensure the minimum `Node.js` version is 

```
v16.9.1
```

Please ensure the minimum `Postgres` version is 
```
v2.2.0
```

Thank you for using the GameShed API!