const initialWaitList = [
  {
    id: 1, name: 'John Smith', number: '93659622',
    created: new Date('2018-08-15'), 
  },
  {
    id: 2, name: 'Mary Sue', number: '9817170+',
    created: new Date('2018-08-15'),
  },
  {
    id: 3, name: 'Test Test', number: '000000000',
    created: new Date('2018-08-15'), 
  },
];


function create_UUID(){
  var dt = new Date().getTime();
  var uuid = 'xxxx-xxxx'.replace(/[xy]/g, function(c) {
      var r = (dt + Math.random()*16)%16 | 0;
      dt = Math.floor(dt/16);
      return (c=='x' ? r :(r&0x3|0x8)).toString(16);
  });
  return uuid;
}

function DisplayHomePage(){.02
    return (
      <div>Welcome to the waitlist tracker.</div>
    );
  }


  function DisplayFreeSlots(props){
    const length = props.waitlist.length;
    if (length < 25) {
      return <div>Current slots filled: {length} / 25</div>;
    }
    return  <div style={{ color: 'red' }}>Current slots filled: {length} / 25. Fully filled. Remove some customers. </div>;
  }

  function WaitRow(props){
      const entry = props.entry;
      return (
        <tr>
          <td>{entry.id}</td>
          <td>{entry.name}</td>
          <td>{entry.number}</td>
          <td>{entry.created.toDateString()}</td>
        </tr>
      );
  }

  function DisplayCustomers(props){
      const waitRows = props.waitlist.map(entry => <WaitRow key = {entry.id} entry = {entry}/>);
      return (
        <table className = "bordered-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Mobile Number</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                {waitRows}
            </tbody>
        </table>
      );
  }
  
  class AddingCustomer extends React.Component {
    constructor(){
      super();
      this.handleAddCust = this.handleAddCust.bind(this);
    }
    
    handleAddCust(e){
      e.preventDefault();
      const form = document.forms.addCustomer;
      const customer = {
        name: form.name.value, number: form.number.value
      }
      this.props.addCustomer(customer);
      form.name.value = '';
      form.number.value = '';
    }

    render() {
      return (
        <form name = "addCustomer" onSubmit = {this.handleAddCust}>
          <input type = 'text' name = 'name' placeholder = 'Name' />
          <input type = 'text' name = 'number' placeholder = 'Mobile Number'/>
          <button>Add</button>
        </form>
      );
    }
  }

  class DeleteCustomer extends React.Component {
    constructor(){
      super();
      this.handleRmCust = this.handleRmCust.bind(this);
    }   

    handleRmCust(e){
      e.preventDefault();
      const form = document.forms.removeCustomer;
      const id = form.id.value;
      this.props.deleteCustomer(id);
      form.id.value = '';

    }

    render() {
      return (
        <form name = "removeCustomer" onSubmit = {this.handleRmCust}>
          <input type = 'text' name = 'id' placeholder = 'ID' />
          <button>Remove</button>
        </form>
      );
    }
  }
  
  class HotelWaitlist extends React.Component {
    constructor(){
      super();
      this.state = {waitlist: []};
      this.addCustomer = this.addCustomer.bind(this);
      this.deleteCustomer = this.deleteCustomer.bind(this);
    }
    
    componentDidMount() {
      this.loadData();
      }

    loadData() {
      setTimeout(() => {
        this.setState({ waitlist: initialWaitList });
      }, 500);
    }

    addCustomer(customer){
      customer.id = create_UUID();
      customer.created = new Date();
      const newCustomerList = this.state.waitlist.slice();
      this.state.waitlist.length < 25 ? newCustomerList.push(customer) : newCustomerList;
      this.setState({waitlist: newCustomerList});
    }
    
    deleteCustomer(id){
      const newCustomerList = this.state.waitlist.slice();
      this.setState({waitlist: newCustomerList.filter(customer => customer.id != id)});
    }

    render() {
      return (
        <React.Fragment>
          <h1>Hotel Waitlist</h1>
          <DisplayHomePage />
          <hr />
          <DisplayFreeSlots waitlist = {this.state.waitlist} />
          <hr />
          <DisplayCustomers waitlist = {this.state.waitlist}/>
          <hr />
          <AddingCustomer addCustomer = {this.addCustomer}/>
          <hr />
          <DeleteCustomer deleteCustomer = {this.deleteCustomer}/>
        </React.Fragment>
      );
    }
  }
  
  const element = <HotelWaitlist />;
  
  ReactDOM.render(element, document.getElementById('contents'));
