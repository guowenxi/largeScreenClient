import React from "react";
import {
  Form,
  Collapse,
  Input,
  Radio,

} from "antd";
import {
  changeDetailData,
  setColor,
} from "../../common/editUtil";
import ColorSelect from "../../common/colorSelect";

import { getColorListMultiple } from "../../common/nameNumEditUtil";

const { Panel } = Collapse;

export default class SvgMapEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.colorItem = { angle: "", colorList: [] };
    this.getColorListMultiple = getColorListMultiple.bind(this);
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    const formItemLayout24 = {
      wrapperCol: { span: 24 },
    };
    const { style } = this.props.data;
    return (
      <Form {...formItemLayout24}>
        <Collapse>
        <Panel header="布局设置" key="1">
        <Form.Item label="三角图形占比">
              <Input
                value={style.blockSize}
                onChange={changeDetailData.bind(this, 1, style, "blockSize")}
              />
            </Form.Item>
            <Form.Item label="排列方向">
              <Radio.Group
                value={style.flexDirection}
                onChange={changeDetailData.bind(
                  this,
                  1,
                  style,
                  "flexDirection"
                )}
              >
                <Radio value={"row"}>水平方向</Radio>
                <Radio value={"column"}>垂直方向</Radio>
              </Radio.Group>
              </Form.Item>
            </Panel>

          <Panel header="图块设置" key="2">
            <Form.Item label="字号(px)">
              <Input
                value={style.fontSize}
                onChange={changeDetailData.bind(this, 1, style, "fontSize")}
              />
            </Form.Item>
              <Form.Item label="行高(px)">
              <Input
                value={style.lineHeight}
                onChange={changeDetailData.bind(this, 1, style, "lineHeight")}
              />
            </Form.Item>
              <Form.Item label="图块高(px)">
              <Input
                value={style.itemHeight}
                onChange={changeDetailData.bind(this, 1, style, "itemHeight")}
              />
            </Form.Item>
                      <Form.Item label="外间距(px)">
              <Input
                value={style.padding}
                onChange={changeDetailData.bind(this, 1, style, "padding")}
              />
            </Form.Item>
            <Form.Item label="文字颜色">
              <ColorSelect
                color={style.fontColor}
                setColor={setColor.bind(this, style, "fontColor")}
              />
            </Form.Item>
            </Panel>
          <Panel header="颜色设置" key="3">
            {this.getColorListMultiple(style, style.colors, "colorList")}
          </Panel>
        </Collapse>
      </Form>
    );
  }
}
