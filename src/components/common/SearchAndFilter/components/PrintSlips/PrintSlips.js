import React from 'react';
import {
  omit,
  isEmpty,
} from 'lodash';
import PropTypes from 'prop-types';
import ReactToPrint from 'react-to-print';

import { Button } from '@folio/stripes/components';

import ComponentToPrint from '../../../ComponentToPrint';
// eslint-disable-next-line import/no-webpack-loader-syntax
import '!style-loader!css-loader!../../../PrintButton/quillEditor.css';
import css from '../../../PrintButton/PrintButton.css';

class PrintSlips extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    templates: PropTypes.object,
    templatesContext: PropTypes.arrayOf(PropTypes.object),
    onAfterPrint: PropTypes.func,
    onBeforePrint: PropTypes.func,
    onClick: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.printContentRef = React.createRef();
  }

  handleOnBeforeGetContent = () => {
    this.props.onClick();
  }

  render() {
    const {
      templatesContext,
      templates,
      onBeforePrint,
      onAfterPrint,
      children,
    } = this.props;

    const btnProps = omit(this.props, ['templatesContext', 'template', 'onBeforePrint', 'onAfterPrint']);
    const hasTemplates = !isEmpty(templates);

    const renderTemplates = () => {
      return templatesContext.map((templateContext) => {
        const templateWithBrake = templates[templateContext['innReachTransaction.centralServerId']].concat('</br>');

        return (
          <ComponentToPrint
            key={templateContext['innReachTransaction.centralServerId']}
            template={templateWithBrake}
            dataSource={templateContext}
          />
        );
      });
    };

    return (
      <>
        <ReactToPrint
          removeAfterPrint
          trigger={() => (
            <Button {...btnProps}>
              {children}
            </Button>
          )}
          content={() => this.printContentRef.current}
          onBeforeGetContent={this.handleOnBeforeGetContent}
          onBeforePrint={onBeforePrint}
          onAfterPrint={onAfterPrint}
        />
        <div className={css.hiddenContent}>
          <div
            className={`ql-editor ${css.qlEditor}`}
            ref={this.printContentRef}
          >
            {templatesContext.length && hasTemplates && renderTemplates()}
          </div>
        </div>
      </>
    );
  }
}

export default PrintSlips;
