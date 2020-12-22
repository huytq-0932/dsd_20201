import React, { Fragment, useCallback, useEffect, useState } from "react";
import StyleListDepartment from "./index.style";
<<<<<<< HEAD
import {
    Col,
    Input,
    Row,
    Button,
} from "antd";
import { useSelector } from "react-redux";
import { FolderAddOutlined } from "@ant-design/icons";

const { Search } = Input;

const Filter = ({ filter, setFilter, setVisible }) => {
    const user = useSelector((state) => state.user.user);

=======
import { Col, Input, Row, Button, Select } from "antd";
import { useSelector } from "react-redux";
import { FolderAddOutlined } from "@ant-design/icons";
import { types } from "../../config/UserConfig";

const { Option } = Select;
const { Search } = Input;

const Filter = ({ filter, setFilter, setVisible, setMode }) => {
    const user = useSelector((state) => state.user.user);

    const renderSelectType = () => (
        <Select
            className="select-box"
            value={filter.type}
            onChange={(value) =>
                setFilter({ ...filter, type: value, page_id: 0 })
            }
            defaultValue="Chưa xác định"
            style={{ width: "75%", marginLeft: 10 }}
        >
            <Option key={-1} value="Chưa xác định">
                Chưa xác định
            </Option>
            {types.map((type, index) => {
                return (
                    <Option key={index} value={type.code}>
                        {type.name}
                    </Option>
                );
            })}
        </Select>
    );
>>>>>>> ec42d30b3f687750451212cd3b1c9ca794be8f5e
    const handlResetFilter = () => {
        setFilter({
            page_id: 0,
            page_size: 20,
            role: "Chưa xác định",
            status: "Chưa xác định",
<<<<<<< HEAD
            search: ""
        });
    };

=======
            search: "",
        });
    };

    const handleCreate = () => {
        setMode("create");
        setVisible(true);
    }
>>>>>>> ec42d30b3f687750451212cd3b1c9ca794be8f5e

    return (
        <Fragment>
            <Row gutter={[16, 16]}>
                <Col span={12}>Danh sách phòng ban</Col>
                <Col flex="right" span={2} offset={10}>
                    <Button
                        block
                        type="primary"
<<<<<<< HEAD
                        onClick={() => setVisible(true)}
=======
                        onClick={() => handleCreate()}
>>>>>>> ec42d30b3f687750451212cd3b1c9ca794be8f5e
                        style={{ width: 200, float: "right" }}
                    >
                        <FolderAddOutlined />
                        Thêm phòng ban
                    </Button>
                </Col>
            </Row>
            <Row gutter={[16, 16]}>
                <Col span={8}>
                    <Search
                        placeholder="Tìm kiếm"
                        onChange={(e) =>
                            setFilter({
                                ...filter,
                                search: e.target.value,
                                page_id: 0,
                            })
                        }
                    />
                </Col>
<<<<<<< HEAD
=======
                {user.role == "SUPER_ADMIN" && (
                    <Col span={7} style={{ display: "flex" }}>
                        <label htmlFor="" style={{ width: "20%" }}>
                            Dự án
                        </label>
                        {renderSelectType()}
                    </Col>
                )}
>>>>>>> ec42d30b3f687750451212cd3b1c9ca794be8f5e
            </Row>
            <Row gutter={[16, 16]}>
                <Col span={8}></Col>
            </Row>
            <Row>
                <Col span={2} style={{ display: "flex", margin: "0 auto" }}>
                    <Button
                        type="primary"
                        block
                        style={{ marginBottom: 10 }}
                        onClick={handlResetFilter}
                    >
                        Reset
                    </Button>
                </Col>
            </Row>
        </Fragment>
    );
};

export default Filter;
