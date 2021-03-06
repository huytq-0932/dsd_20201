import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import { Form, Input, Col, Row, InputNumber } from "antd";
import React, { useEffect, useState, useMemo } from "react";
import VisibilityIcon from '@material-ui/icons/Visibility';
import Image from 'react-bootstrap/Image'
import { Spin } from 'antd';
import { getProjectType, getUser } from '../../components/Drone/Common/info';
import axios from 'axios';
import { logEdit, logDelete } from '../../apis/drone';

const useStyles = makeStyles((theme) => ({
  image: {
    width: 300,
    height: 300,
    resizeMode: 'cover'
  },
  input: {
    fontSize: 20,
  },
  formItem: {
    padding: 10,
    margin: 0
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    // border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },

  button: {
    margin: theme.spacing(1),
  },

  divButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
}));



export default function TransitionsModal(props) {
  const [loader, setLoader] = React.useState(false);
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const [drones, setDrones] = useState([]);

  const getData = () => {
    fetch("http://skyrone.cf:6789/drone/getById/" + props.id)
      .then(response => response.json())
      .then(json => {
        setDrones(json);
        console.log(json);
        setOpen(true);
        initFormData(json);
      });
  };

  const handleOpen = () => {
      getData();
      
  };

  const handleChangeInput = (val) => {
    return val;
  }

  const handleClose = () => {
    setOpen(false);
  };
  const delteDrone = () => {
    setLoader(true);
    fetch("http://skyrone.cf:6789/drone/delete/" + props.id)
      .then(response => response.json())
      .then(json => {
        setDrones(json);
        alert("Đã xóa thành công")
        setOpen(false);

        // console.log('response delete drone', json);
        //ghi log
        const user = getUser();
        const logData = {
          projectType: getProjectType(),
          authorId: user.id.toString(),
          entityId: props.id,
          description: "DELETE DRONE",
          name: drones.name,
          regionId: "NONE",
          longitude: 0,
          latitude: 0,  
          uavConnectId: "NONE"
        };
        logDelete(logData)

        window.location.reload();
      });
  };
  const initFormData = (json) => {

    setName(json.name);
    setBrand(json.brand);
    setColor(json.color);
    setDimensions(json.dimensions);
    setMaxFlightHeight(json.maxFlightHeight);
    setMaxFlightRange(json.maxFlightRange);
    setMaxFlightSpeed(json.maxFlightSpeed);
    setMaxFlightTime(json.maxFlightTime);
    setBattery(json.rangeBattery);
    setUrlImage(json.urlImage);
    setType(json.type);
  }

  const [urlImage, setUrlImage] = useState();
  const [name, setName] = useState("");
  const [brand, setBrand] = useState(drones.brand);
  const [color, setColor] = useState(drones.color);
  const [dimensions, setDimensions] = useState(drones.dimensions);
  const [maxFlightHeight, setMaxFlightHeight] = useState(drones.maxFlightHeight);
  const [maxFlightRange, setMaxFlightRange] = useState(drones.maxFlightRange);
  const [maxFlightSpeed, setMaxFlightSpeed] = useState(drones.maxFlightSpeed);
  const [maxFlightTime, setMaxFlightTime] = useState(drones.maxFlightTime);
  const [rangeBattery, setBattery] = useState(drones.rangeBattery);
  const [type, setType] = useState(drones.type)
  const saveDrone = () => {
    setLoader(true);
    let headers = new Headers();

    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    headers.append('Access-Control-Allow-Origin', '*');

    const requestOptions = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ 
        brand: brand,
        color: color,
        dimensions: dimensions,
        id: props.id,
        idLog: 0,
        maxFlightHeight: maxFlightHeight,
        maxFlightRange: maxFlightRange,
        maxFlightSpeed: maxFlightSpeed,
        maxFlightTime: maxFlightTime,
        name: name,
        rangeBattery: rangeBattery,
        task: 0,
        used: false,
        type: type,
        urlImage: urlImage
      })
    };
    fetch('http://skyrone.cf:6789/drone/save', requestOptions)
    .then(response => response.json())
    .then(contents =>  {
      alert("Đã cập nhật thành công"); 
      setOpen(false);

      // console.log('drone edit', contents)
      //ghi log
      const user = getUser();
      const logData = {
        projectType: getProjectType(),
        authorId: user.id.toString(),
        entityId: contents.id,
        description: "EDIT DRONE",
        name: contents.name,
        regionId: "NONE",
        longitude: 0,
        latitude: 0,  
        uavConnectId: "NONE"
      };
      logEdit(logData);

      window.location.reload();
    })

    .catch((err) => {
      console.log(err)
      console.log("Can’t access response. Blocked by browser?")
    })
  }

  return (
    <div>

      <Button
        onClick={handleOpen}
        variant="contained"
        color="primary"
        startIcon={<EditOutlinedIcon />}
      >
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <h2 id="transition-modal-title">Id# : {props.id} </h2>
            <Row >
            <Col>
                <Form.Item className={classes.formItem}>
                  <h4>Tốc độ tối đa (m/phút)</h4>
                  <InputNumber  min={1} 
                    value={maxFlightSpeed}
                    className={classes.input}
                    onChange={event => setMaxFlightSpeed(event)}
                  />
                </Form.Item>
                <Form.Item className={classes.formItem}>
                  <h4>Thời gian bay (phút)</h4>
                  <InputNumber min={1} 
                    value={maxFlightTime}
                    className={classes.input}
                    onChange={event => setMaxFlightTime(event)}
                  />
                </Form.Item>
                <Form.Item className={classes.formItem}>
                  <h4>Trần bay (m)</h4>
                  <InputNumber min={1} 
                    value={maxFlightHeight}
                    className={classes.input}
                    onChange={event => setMaxFlightHeight(event)}
                  />
                </Form.Item>
                <Form.Item className={classes.formItem}>
                  <h4>Dung lượng pin (mAh)</h4>
                  <InputNumber min={1} style={{ width: '80%' }}
                    value={rangeBattery}
                    className={classes.input}
                    onChange={event => setBattery(event)}
                  />
                </Form.Item>
                <Form.Item className={classes.formItem}>
                  <h4>Loại</h4>
                  <InputNumber min={1} 
                    value={type}
                    className={classes.input}
                    onChange={event => setType(event)}
                  />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item className={classes.formItem}>
                  <h4>Nhãn Hiệu</h4>
                  <Input
                    value={brand}
                    className={classes.input}
                    onChange={event => setBrand(event.target.value)}
                  />
                </Form.Item>
                <Form.Item className={classes.formItem}>
                  <h4>Màu</h4>
                  <Input
                    type="text" 
                    value={color}
                    className={classes.input}
                    onChange={event => setColor(event.target.value)}
                  />
                </Form.Item>
                <Form.Item className={classes.formItem}>
                  <h4>Kích thước</h4>
                  <Input
                    value={dimensions}
                    className={classes.input}
                    onChange={event => setDimensions(event.target.value)}
                  />
                </Form.Item>
                <Form.Item className={classes.formItem}>
                  <h4>Giới hạn tầm bay (m)</h4>
                  <InputNumber size="large" min={1} 
                    value={maxFlightRange}
                    className={classes.input}
                    onChange={event => setMaxFlightRange(event)}
                  />
                </Form.Item>
              </Col>
              <Col>
              <Form.Item className={classes.formItem}>
                  <h4>Tên</h4>
                  <Input
                    value={name}
                    className={classes.input}
                    onChange={event => setName(event.target.value)}
                  />
                </Form.Item>
               <Image className={classes.image} src={urlImage} rounded />
              </Col>
            </Row>
            <div className={classes.divButton}>
            {loader? (
                  <Spin></Spin>
              ) : (
                <div>
                  <Button
                    onClick={delteDrone}
                    variant="contained"
                    color="secondary"
                    className={classes.button}
                    startIcon={<DeleteIcon />}
                  >
                    Xóa Drone
                  </Button>
                  <Button
                  onClick={saveDrone}
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  startIcon={<SaveIcon />}
                >
                  Lưu
                </Button>
               </div>
              )}
              
             </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );

}

