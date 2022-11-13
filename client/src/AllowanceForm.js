import React from 'react';
import { Form, Button, Message, Segment } from 'semantic-ui-react';

class AllowanceForm extends React.Component {
  state = {
    errorMessage: '',
    fromAddress: this.props.signerAddress,
    toAddress: this.props.signerAddress,
    allowance: null
  }

  getAllowance = async () => {
    this.setState({ errorMessage: '' });

    try {
      const allowance = await this.props.contract.allowance(
        this.state.fromAddress,
        this.state.toAddress
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
          label='from'
          placeholder='address'
          value={this.state.fromAddress}
          onChange={(e) => this.setState({ fromAddress: e.target.value })}
        />
        <Form.Input
          label='to'
          placeholder='address'
          value={this.state.toAddress}
          onChange={(e) => this.setState({ toAddress: e.target.value })}
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
