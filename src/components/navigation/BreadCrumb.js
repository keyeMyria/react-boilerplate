import React from 'react';
import { Breadcrumb } from 'semantic-ui-react';
import './styles.css';

class BreadCrumb extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      pageName: (typeof props.pageName !== 'undefined') ? props.pageName : null
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.pageName !== nextProps.pageName) {
      this.setState({
        pageName: nextProps.pageName
      });
    }
  }

  render() {
    const { pageName } = this.state;

    return (
      <Breadcrumb>
        <Breadcrumb.Section>Home</Breadcrumb.Section>
        <Breadcrumb.Divider icon='right angle' />
        <Breadcrumb.Section className='page-name' active>{pageName.toString().replace('/', '')}</Breadcrumb.Section>
      </Breadcrumb>
    );
  }
}

export default BreadCrumb;
