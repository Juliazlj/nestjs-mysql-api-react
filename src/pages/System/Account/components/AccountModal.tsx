import React, { PropsWithChildren, useEffect, useState } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { useRequest } from 'ahooks';

import { AccountResDto } from '../types/account.list.res.dto';
import { mobileReg, usernameReg, emailReg } from 'src/constants';
import AccountService from 'src/services/account';

const { Option } = Select;

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

type Props = PropsWithChildren<{
  isModifyVisible: boolean;
  setIsModifyVisible: (isShow: boolean) => void;
  loadData: () => void;
  rowData?: AccountResDto;
}>;

// 包装提交数据
const createAccountHandler = async (postData: any) => {
  const result = await AccountService.createAccount(postData);
  if (!result) return;
  return new Promise(resolve => {
    resolve(true);
  });
};

const modifyAccountHandler = async (id: number, params: any) => {
  const result = await AccountService.modifyAccountById(id, params);
  if (!result) return;
  return new Promise(resolve => {
    resolve(true);
  });
};

const AccountModal = (props: Props) => {
  const { isModifyVisible, setIsModifyVisible, rowData, loadData } = props;
  const [rowId, setRowId] = useState<number | null>();
  const [title, setTitle] = useState<string>('新增账号');
  const [form] = Form.useForm();

  const { run } = useRequest(createAccountHandler, {
    manual: true,
    onSuccess: result => {
      if (result) {
        setIsModifyVisible(false);
        // 告知父组件更新数据
        loadData();
        form.resetFields();
      }
    },
  });

  const { run: run1 } = useRequest(modifyAccountHandler, {
    manual: true,
    onSuccess: result => {
      if (result) {
        setIsModifyVisible(false);
        // 告知父组件更新数据
        loadData();
        form.resetFields();
      }
    },
  });

  useEffect(() => {
    if (rowData) {
      const { username, mobile, email, status, platform } = rowData;
      form.setFieldsValue({
        username,
        mobile,
        email,
        status: String(status),
        platform: String(platform),
      });
      setTitle('编辑账号');
      setRowId(rowData.id);
    } else {
      setTitle('新增账号');
      form.resetFields();
      setRowId(null);
    }
  }, [rowData]);

  // 提交
  const handleModifyOk = () => {
    form.validateFields(['username', 'mobile', 'email', 'status', 'platform']).then(values => {
      // 根据当前是否有id区分是新增还是编辑
      if (rowId) {
        run1(rowId, values);
      } else {
        // 提交数据
        run(values);
      }
    });
  };

  // 取消
  const handleModifyCancel = () => {
    setIsModifyVisible(false);
    form.resetFields();
  };

  return (
    <>
      <Modal
        title={title}
        visible={isModifyVisible}
        onOk={handleModifyOk}
        onCancel={handleModifyCancel}
      >
        <Form form={form} {...layout}>
          <Form.Item
            name="username"
            label="用户名"
            rules={[
              {
                required: true,
                message: '请输入用户名',
              },
              {
                pattern: usernameReg,
                message: '用户名必须是大写字母、小写字符、.4-20位字符',
              },
            ]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item
            name="mobile"
            label="手机号码"
            rules={[
              {
                pattern: mobileReg,
                message: '请输入正确的手机号',
              },
            ]}
          >
            <Input placeholder="请输入手机号码" />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              {
                pattern: emailReg,
                message: '请输入正确的邮箱',
              },
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select placeholder="请选择状态" allowClear>
              <Option value="1">正常</Option>
              <Option value="0">禁用</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="platform"
            label="平台"
            rules={[
              {
                required: true,
                message: '请选择平台',
              },
            ]}
          >
            <Select placeholder="请选择平台" allowClear>
              <Option value="1">运营平台</Option>
              <Option value="2">商家平台</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AccountModal;
