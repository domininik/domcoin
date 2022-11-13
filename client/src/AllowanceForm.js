import React from 'react';
import { Form, Button, Message, Segment } from 'semantic-ui-react';

class AllowanceForm extends React.Component {
  state = {
    errorMessage: '',
    owner: this.props.signerAddress,
    spender: this.props.signerAddress,
    allowance: null
  }

  getAllowance = async () => {
    this.setState({ errorMessage: '' });

    try {
      const allowance = await this.props.contract.allowance(
        this.state.owner,
        this.state.spender
      );
      this.setState({ allowance: allowance.toString() });
    } catch (error) {
      this.setState({ errorMessage: error.message });
    }
  }

  render() {
    return(
      <Form onSubmit={this.getAllowance} error={!!this.state.errorMessage}>
        <Message error header="Error" content={this.state.errorMessage} />
        <Form.Input
          label='owner'
          placeholder='address'
          value={this.state.owner}
          onChange={(e) => this.setState({ owner: e.target.value })}
        />
        <Form.Input
          label='spender'
          placeholder='address'
          value={this.state.spender}
          onChange={(e) => this.setState({ spender: e.target.value })}
        />
        <Button content='Get allowance' />
        {
          this.state.allowance ? (
            <Segment textAlign='center'>{ this.state.allowance }</Segment>
          ) : null
        }
      </Form>
    )
  }
}

export default AllowanceForm;
