// src/components/Cat.js
import React from 'react';

const Cat = ({ mouse }) => {
  return (
    <img
      src="/cat.jpg"
      alt="cat"
      style={{ position: 'absolute', left: mouse.x, top: mouse.y }}
    />
  );
};

export default Cat;

// src/components/Mouse.js
import React, { Component } from 'react';

class Mouse extends Component {
  state = { x: 0, y: 0 };

  handleMouseMove = (e) => {
    this.setState({ x: e.clientX, y: e.clientY });
  };

  render() {
    return (
      <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>
        {/* Render prop function */}
        {this.props.render ? this.props.render(this.state) : null}
        {/* Children as function */}
        {typeof this.props.children === 'function' ? this.props.children(this.state) : this.props.children}
      </div>
    );
  }
}

export default Mouse;

// src/components/MouseTracker.js
import React from 'react';
import Mouse from './Mouse';
import Cat from './Cat';

const MouseTracker = () => {
  return (
    <div>
      <h1>Move the mouse around!</h1>

      {/* Example using render prop */}
      <Mouse render={(mouse) => <Cat mouse={mouse} />} />

      {/* Example using children as a function */}
      <Mouse>
        {(mouse) => (
          <p style={{ position: 'absolute', top: 0, left: 0 }}>
            Mouse is at ({mouse.x}, {mouse.y})
          </p>
        )}
      </Mouse>
    </div>
  );
};

export default MouseTracker;

// src/App.js
import React from 'react';
import MouseTracker from './components/MouseTracker';

function App() {
  return (
    <div className="App">
      <MouseTracker />
    </div>
  );
}

export default App;

// Optional: Add PropTypes if needed
// import PropTypes from 'prop-types';
// Mouse.propTypes = {
//   render: PropTypes.func,
//   children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
// };
