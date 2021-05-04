import {Badge, Button, Radio, Spin, Tag} from 'antd';
import './App.css';
import StudentDrawerForm from "./StudentDrawerForm";
import {useState, useEffect} from "react";
import {deleteStudent, getAllStudents} from "./client";
import { Layout, Menu, Breadcrumb, Table , Image } from 'antd';
import { Popconfirm, message } from 'antd';
import {
    DesktopOutlined,
    PieChartOutlined,
    FileOutlined,
    TeamOutlined,
    UserOutlined, LoadingOutlined, DownloadOutlined, PlusOutlined, MinusOutlined,
} from '@ant-design/icons';
import { Empty } from 'antd';
import Avatar from "antd/es/avatar/avatar";
import {errorNotification, successNotification} from "./Notification";
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const text = 'Are you sure to delete this task?';

function confirm() {
    message.info('Clicked on Yes.');
}
function cancel(e) {
    console.log(e);
    message.error('Click on No');
}
const TheAvatar=({name}) =>{
    let trim = name.trim();
    if(trim.length===0 ){
        return <Avatar icon={<UserOutlined/>}/>
    }
    const split =trim.split(" ");
    if(split.length===1){
        return <Avatar>{name.charAt(0)}</Avatar>
    }
    return <Avatar>{`${name.charAt(0)}${name.charAt(name.length-1)}`}</Avatar>
}

const removeStudent = (studentId, callback) => {
    deleteStudent(studentId).then(() => {
        successNotification("Student deleted", `Student with ${studentId} was deleted`);
        callback();
    }).catch(err => {
        console.log(err);
        err.response.json().then(res => {
            console.log(res);
            errorNotification(
                "There was an issue",
                `${res.message} [${res.status}] [${res.error}]`,
                "bottomLeft"
            )
        });

    })
}

const columns =fetchStudents => [
    {
        title: 'Avatar',
        dataIndex: 'avatar',
        key: 'avatar',
        render:(text, student) => <TheAvatar name={student.name}/>
    },

    {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Gender',
        dataIndex: 'gender',
        key: 'gender',
    },
    {
        title: 'Actions',
        key: 'actions',
        render: (text, student) =>
            <Radio.Group>
                <Popconfirm
                    placement='topRight'
                    title={`Are you sure to delete ${student.name}`}
                    onConfirm={() => removeStudent(student.id, fetchStudents)}
                    okText='Yes'
                    cancelText='No'>
                    <Radio.Button value="small">Delete Student</Radio.Button>
                </Popconfirm>
                <Radio.Button value="small">Edit Student</Radio.Button>
            </Radio.Group>
    }
];

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
function App() {
    const [students, setStudents]= useState([]);
    const [collapsed, setCollapsed] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [showDrawer, setShowDrawer] = useState(false);

    const fetchStudents=()=>
        getAllStudents().
        then(res=> res.json())
            .then(data=> {
                console.log(data);
                setStudents(data);

            }).catch(err=>{
                console.log(err.response)
            err.response.json().then(res=>{
                console.log(res);
                errorNotification("There was an issue",
                    `${res.message} [${res.status}] [${res.error}]`)
            });
        }).finally(()=>setFetching(false))



    useEffect(()=>{
        console.log("component has mounted");
        fetchStudents();
    },[]);

    const renderStudents = () =>{
        if(fetching){
            return <Spin indicator={antIcon} />
        }
        if(students.length<=0){
            return <>

                <Button
                    onClick={() => setShowDrawer(!showDrawer)}
                    type="primary" shape="round" icon={<PlusOutlined  />} size="small">
                    Add New Student
                </Button>
                <StudentDrawerForm
                    showDrawer={showDrawer}
                    setShowDrawer={setShowDrawer}
                    fetchStudents={fetchStudents}
                />
                <Empty />
            </>
        }
        return <>

            <StudentDrawerForm
                showDrawer={showDrawer}
                setShowDrawer={setShowDrawer}
                fetchStudents={fetchStudents}
            />
                    <Table dataSource={students}
                      columns={columns(fetchStudents)}
                           bordered
                      title={() => <> <Tag color="blue-inverse">Number of Students: </Tag>
                          <Badge count={students.length } className="site-badge-count-4" />
                          <Button
                              onClick={() => setShowDrawer(!showDrawer)}
                              type="primary" shape="round" icon={<PlusOutlined  />} size="small">
                              Add New Student
                          </Button>
                          </>
                      }
                      footer={() => <>
                          <Button
                          onClick={() => setShowDrawer(!showDrawer)}
                          type="primary" shape="round" icon={<PlusOutlined  />} size="small">
                          Add New Student
                      </Button>
                          <hr/>
                          <Badge count={students.length} className="site-badge-count-4" />

                      </>
                      }
                      pagination={{ pageSize: 100 }} scroll={{ y: 540 }}
                      rowKey={(student)=> student.id}

        />
        </>
    }


    getAllStudents().
    then(res=> res.json())
        .then(console.log)


  return (
      // students.map((student,index)=>{
      //     return <p key={index}>{student.id} {student.name} {student.email}</p>;
      // }
    <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
            <div className="logo" />
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                <Menu.Item key="1" icon={<PieChartOutlined />}>
                    Option 1
                </Menu.Item>
                <Menu.Item key="2" icon={<DesktopOutlined />}>
                    Option 2
                </Menu.Item>
                <SubMenu key="sub1" icon={<UserOutlined />} title="User">
                    <Menu.Item key="3">Tom</Menu.Item>
                    <Menu.Item key="4">Bill</Menu.Item>
                    <Menu.Item key="5">Alex</Menu.Item>
                </SubMenu>
                <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
                    <Menu.Item key="6">Team 1</Menu.Item>
                    <Menu.Item key="8">Team 2</Menu.Item>
                </SubMenu>
                <Menu.Item key="9" icon={<FileOutlined />}>
                    Files
                </Menu.Item>
            </Menu>
        </Sider>
        <Layout className="site-layout">
            <Header className="site-layout-background" style={{ padding: 0 }} />
            <Content style={{ margin: '0 16px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>User</Breadcrumb.Item>
                    <Breadcrumb.Item>Bill</Breadcrumb.Item>
                </Breadcrumb>
                <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                    {students.length<=0?'No data present yet ' : 'Table has data as seen below'}
                    {renderStudents()}
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>JohnQ ©2021 Created by John Q.
                <hr/>
                <Image
                    width ={75}
                    src="https://picsum.photos/seed/picsum/200/300" />

            </Footer>
        </Layout>
    </Layout>

      );


}

export default App;
// /*
// // <div className="App">
//         {/*<div><b>{students.length}</b></div><br/>*/}
//
// {/*  <Button type ='primary'> Hello</Button><hr/>*/}
// {/*    <Radio.Group value='large' >*/}
// {/*        <Radio.Button value="large">Large</Radio.Button>*/}
// {/*        <Radio.Button value="default">Default</Radio.Button>*/}
// {/*        <Radio.Button value="small">Small</Radio.Button>*/}
// {/*    </Radio.Group>*/}
//
//
// {/*</div>*/}
//  */