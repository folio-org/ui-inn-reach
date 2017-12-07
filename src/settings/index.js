import React from 'react';
import Settings from '@folio/stripes-components/lib/Settings';
import GeneralSettings from './GeneralSettings';
import SomeFeatureSettings from './SomeFeatureSettings';

const pages = [
  {
    route: 'general',
    label: 'General',
    component: GeneralSettings,
  },
  {
    route: 'somefeature',
    label: 'Some Feature',
    component: SomeFeatureSettings,
  },
];

export default class <%= componentName %>Settings extends React.Component {
  render() {
    return (
      <Settings {...this.props} pages={pages} paneTitle="Hello World" />
    );
  }
}
