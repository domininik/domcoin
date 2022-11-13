import React from 'react';
import { ethers } from 'ethers';
import { Form, Button, Message } from 'semantic-ui-react';

class ApproveForm extends React.Component {
  state = {
    errorMessage: '',
    address: this.props.signerAddress,
    value: 0
  }

  approve = async () => {
    this.setState({ errorMessage: '' });

    try {
      const allowance = await this.props.contract.approve(
        this.state.address,
        ethers.utils.formatUnits(this.state.value, 0)
      );
    } catch (error) {
      this.setState({ errorMessage: error.message });
    }
  }

  render() {
    return(
      <Form onSubmit={this.approve} error={!!this.state.errorMessage}>
        <Message error header="Error" content={this.state.errorMessage} />
        <Form.Input
          label='from'
          placeholder='address'
          value={this.state.address}
          onChange={(e) => this.setState({ address: e.target.value })}
        />
        <Form.Input
          label='value'
          placeholder='value'
          value={this.state.value}
          onChange={(e) => this.setState({ value: e.target.value })}
        />
        <Button primary content='Set allowance' />
      </Form>
    )
  }
}

export default ApproveForm;
