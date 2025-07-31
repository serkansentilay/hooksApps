/*
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button>
      </div>
    );
  }
}

*/

/*
 1. Fonksiyon Bileşen (Functional Component) — useState ile

🚀 TypeScript ile örnek:
import React, { useState, ChangeEvent } from 'react';

type FormData = {
  count: number;
  name: string;
};

function Example() {
  const [formData, setFormData] = useState<FormData>({
    count: 0,
    name: 'Serkan',
  });

  const increment = () => {
    setFormData(prev => ({
      ...prev,
      count: prev.count + 1,
    }));
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      name: e.target.value,
    }));
  };

  return (
    <div>
      <p>{formData.name}, {formData.count} kez tıkladın.</p>
      <button onClick={increment}>Tıkla</button>
      <input value={formData.name} onChange={handleNameChange} />
    </div>
  );
}
*/


/*
2. Class Bileşeni (Class Component) — this.state ile

🚀 TypeScript ile örnek:
import React, { Component, ChangeEvent } from 'react';

type State = {
  count: number;
  name: string;
};

class Example extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      count: 0,
      name: 'Serkan',
    };
  }

  increment = () => {
    this.setState(prevState => ({
      count: prevState.count + 1,
    }));
  };

  handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ name: e.target.value });
  };

  render() {
    return (
      <div>
        <p>{this.state.name}, {this.state.count} kez tıkladın.</p>
        <button onClick={this.increment}>Tıkla</button>
        <input value={this.state.name} onChange={this.handleNameChange} />
      </div>
    );
  }
}
*/

