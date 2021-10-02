const fs = require('fs');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');

let aboutMessage = "Customer Tracker API v1.0";

const custDB = [
  {
    id: 'xxxx-xxxx', name: 'John Smith', number: '93659622',
    created: new Date('2018-08-15'), 
  },
  {
    id: 'xxxx-xxxx', name: 'Mary Sue', number: '9817170+',
    created: new Date('2018-08-15'),
  },
  {
    id: 'xxxx-xxxx', name: 'Test Test', number: '000000000',
    created: new Date('2018-08-15'), 
  },
];

const GraphQLDate = new GraphQLScalarType({
  name: 'GraphQLDate',
  description: "A Date() type in GraphQL as scalar",
  serialize(value){
    return value.toISOString();
  },
  parseValue(value) {
    return new Date(value);
  },
  parseLiteral(ast) {
    return (ast.kind == Kind.STRING) ? new Date(ast.value) : undefined;
  },  
});

const resolvers = {
  Query:{
    about: () => aboutMessage,
    custList,
  },
  Mutation:{
    setAboutMessage,
    custAdd,
  },
  GraphQLDate,
};

function create_UUID(){
  var dt = new Date().getTime();
  var uuid = 'xxxx-xxxx'.replace(/[xy]/g, function(c) {
      var r = (dt + Math.random()*16)%16 | 0;
      dt = Math.floor(dt/16);
      return (c=='x' ? r :(r&0x3|0x8)).toString(16);
  });
  return uuid;
}

function custAdd(_, {cust}){
  cust.created = new Date();
  cust.id = create_UUID();
  custDB.push(cust);
  return cust;
}

function setAboutMessage(_, {message}){
  return aboutMessage = message;
}

function custList(){
  return custDB
}

const server = new ApolloServer({
  typeDefs: fs.readFileSync('./server/schema.graphql', 'utf-8'),
  resolvers,
});

const app = express();

app.use(express.static('public'));

server.applyMiddleware({ app, path: '/graphql' });

app.listen(3000, function () {
  console.log('App started on port 3000');
});