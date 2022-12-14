import React from 'react';
import { ethers } from 'ethers';
import { Form, Button, Message } from 'semantic-ui-react';

class BurnForm extends React.Component {
  state = {
    errorMessage: '',
    value: 0
  }

  burn = async () => {
    this.setState({ errorMessage: '' });
    
    try {
      await this.props.contract.burn(
        ethers.utils.formatUnits(this.state.value, 0)
      );
    } catch (error) {
      this.setState({ errorMessage: error.message });
    }
  }

  render() {
    return(
      <Form onSubmit={this.burn} error={!!this.state.errorMessage}>
        <Message error header="Error" content={this.state.errorMessage} />
        <Form.Input
          label='value'
          placeholder='value'
          value={this.state.value}
          onChange={(e) => this.setState({ value: e.target.value })}
        />
        <Button content='Burn' negative />
      </Form>
    )
  }
}

export default BurnForm;
