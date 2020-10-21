import React, { Component } from "react";
import ReactDOM from "react-dom";
//import uuid from "uuid/v4";
import {v4 as uuid} from "uuid";
import styled from "styled-components";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import RGL, { WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
// import "react-resizable/css/styles.css";
import { Line } from 'react-lineto';
import LineTo from 'react-lineto';

import { Resizable, ResizableBox } from 'react-resizable';



import NavOne from './NavOne';
import NavTwo from './NavTwo';
import NavThree from './NavThree';
import NavFour from './NavFour';
import NavFive from './NavFive';
// import StraightLine from './StraightLine';
// import VerticalLine from './VerticalLine';

const ReactGridLayout = WidthProvider(RGL);

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
console.log(result);
  return result;
};

let filterLists;


/**
 * Moves an item from one list to another list.
 */
const copy = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  sourceClone.forEach((item, index) => {
    item.w = 3;
    item.h = 1;
    item.x = 1;
    item.y = 1;
    item.i = index;
  });
  const destClone = Array.from(destination);
  const item = sourceClone[droppableSource.index];
  destClone.splice(droppableDestination.index, 0, { ...item, id: uuid() });
  return destClone;
};

const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const Content = styled.div`
  margin-right: 100px;
  padding:25px;
`;

const Item = styled.div`
  display: flex;
  user-select: none;
  padding: 0.5rem;
  margin: 0 0 0.5rem 0;
  align-items: flex-start;
  align-content: flex-start;
  border-radius: 3px;
  background: #fff;
  overflow: hidden;
  /* background: ${props => (props.isDragging ? "red" : "blue")}; */
  border: 1px ${props => (props.isDragging ? "dashed #000" : "solid #ddd")};
`;

const ItemDropped = styled(Item)`
  line-height: calc(75%);
  @media (max-width: 768px) {
    font-size: 8px;
    text-align: left;
  }
`;

const removeBtn = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  color: red;
`;

const drawLines = styled.div`
position: absolute;
border: 0px;
overflow: hidden;
width: 143px;
height: 32px;
`;

const ItemLineDropped = styled(drawLines)`
line-height: 0px;
`;

const ItemBtn = styled(removeBtn)`
  line-height: calc(75%);
  @media (max-width: 768px) {
    font-size: 8px;
    text-align: left;
  }
`;

const Clone = styled(Item)`
  + div {
    display: none !important;
  }
`;

const Handle = styled.div`
  display: flex;
  align-items: center;
  align-content: center;
  user-select: none;
  margin: -0.5rem 0.5rem -0.5rem -0.5rem;
  padding: 0.5rem;
  line-height: 1.5;
  border-radius: 3px 0 0 3px;
  background: #fff;
  border-right: 1px solid #ddd;
  color: #000;
`;

const List = styled.div`
  border: 1px ${props => (props.isDraggingOver ? "dashed #000" : "solid #ddd")};
  background: #fff;
  padding: 0.5rem 0.5rem 0;
  border-radius: 3px;
  flex: 0 0 150px;
  font-family: sans-serif;
`;

const Kiosk = styled(List)`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  margin-top:25px;
`;

const Container = styled(List)`
  margin: 0.5rem 0.5rem 1.5rem;
`;

const Notice = styled.div`
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  padding: 0.5rem;
  margin: 0 0.5rem 0.5rem;
  border: 1px solid transparent;
  line-height: 1.5;
  color: #aaa;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  margin: 0.5rem;
  padding: 0.5rem;
  color: #fff;
  border: 1px solid #ddd;
  background: #6b6e70;
  border-radius: 3px;
  font-size: 1rem;
  cursor: pointer;
`;

const ButtonText = styled.div`
  margin: 0 1rem;
`;

//let filetrList = [];


const ITEMS = [
  {
    id: uuid(),
    content: <NavOne />
  },
  
  // {
  //   id: uuid(),
  //   content: "Copy"
  // },
  {
    id: uuid(),
    content: <NavTwo />
  },
  {
    id: uuid(),
    content: <NavThree />
  },
  {
    id: uuid(),
    content: <NavFour />
  },
  {
    id: uuid(),
    content: <NavFive />
  },
  // {
  //   id: uuid(),
  //   content: <StraightLine />
  // },
  // {
  //   id: uuid(),
  //   content: <VerticalLine />
  // }

  
  
];

class App extends Component {
  state = {
    [uuid()]: [],
    filterList : [],
    x: 0,
    y: 0,
    isResize: false
  };
  static defaultProps = {
    className: "layout",
    // items: 20,
    rowHeight: 150,
    onLayoutChange: function() {},
    cols: 12,
    
  };

  

  handleMouseClick = (event) => {
    console.log(event.clientX);
    console.log(event.clientY);
    this.setState({
      x: event.pageX,
      y: event.pageY
    });
  }

  onDragEnd = result => {
    const { source, destination, reason } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    if (!destination || reason === 'CANCEL') {
      this.setState({
        draggingRowId: null,
      });
      return;
    }

    switch (source.droppableId) {
      case destination.droppableId:
        this.setState({
          [destination.droppableId]: reorder(
            this.state[source.droppableId],
            source.index,
            destination.index
          )
        });
        break;
      case "ITEMS":
        this.setState({
          [destination.droppableId]: copy(
            ITEMS,
            this.state[destination.droppableId],
            source,
            destination
          )
        });
        break;
      default:
        this.setState(
          move(
            this.state[source.droppableId],
            this.state[destination.droppableId],
            source,
            destination
          )
        );
        break;
    }
  };

  addList = e => {
    this.setState({ uid : [] });
    console.log(this.state);
  };

  saveComponent = e => {
    //console.log(this.state);
    // let comp = this.state;
    const idconst = this.state;
    //console.log(idconst);
    const idKey = Object.keys(idconst)[0];
    let completeArrList = idconst[idKey];
    
    completeArrList.map(compType => {
      if(compType.content.type.name == "NavOne")
      {
        this.postCompOne(compType);
      } else if(compType.content.type.name == "NavTwo")
      {
        this.postCompTwo(compType);
      } else if(compType.content.type.name == "NavThree")
      {
        this.postCompThree(compType);
      } else if(compType.content.type.name == "NavFour")
      {
        this.postCompFour(compType);
      } else if(compType.content.type.name == "NavFive")
      {
        this.postCompFive(compType);
      }
    })
  }

  postCompOne = e => {
    console.log(e);
    let createCompArr = [];
    createCompArr.push(e)
    createCompArr.map(val => {
      fetch('http://localhost:3002/?arrval=val1')
    .then(res => {
      console.log(res);
      console.log(val);
    
    }).catch(err => {
      console.log(err);
    })
    })
  }

  postCompTwo = e => {
    console.log(e);
    let createCompArr = [];
    createCompArr.push(e)
    createCompArr.map(val => {
      fetch('http://localhost:3002/?arrval=val2')
    .then(res => {
      console.log(res);
      console.log(val);
    
    }).catch(err => {
      console.log(err);
    })
    })
  }

  postCompThree = e => {
    console.log(e);
    let createCompArr = [];
    createCompArr.push(e)
    createCompArr.map(val => {
      fetch('http://localhost:3002/?arrval=val3')
    .then(res => {
      console.log(res);
      console.log(val);
    
    }).catch(err => {
      console.log(err);
    })
    })
  }

  postCompFour = e => {
    console.log(e);
    let createCompArr = [];
    createCompArr.push(e)
    createCompArr.map(val => {
      fetch('http://localhost:3002/?arrval=val4')
    .then(res => {
      console.log(res);
      console.log(val);
    
    }).catch(err => {
      console.log(err);
    })
    })
  }

  postCompFive = e => {
    console.log(e);
    let createCompArr = [];
    createCompArr.push(e)
    createCompArr.map(val => {
      fetch('http://localhost:3002/?arrval=val5')
    .then(res => {
      console.log(res);
      console.log(val);
    
    }).catch(err => {
      console.log(err);
    })
    })
  }
  
  clearallComponent = e => {
    this.setState([]);
    //this.setState = {};
  }

  onLayoutChange(layout) {
    console.log("onLayoutChangeonLayoutChangeonLayoutChange", layout);
    this.props.onLayoutChange(layout);
    
  }

  showResizable = (item) => {
    this.setState({isResize: true})
  }

  hideResizable = (item) => {
    this.setState({isResize: false})
  }
  
  handleRemove = (item) => {
    let id = item.id;
    console.log(id);
    const idconst = this.state;
    //console.log(idconst);
    const idKey = Object.keys(idconst)[0];
    let completeArrList = idconst[idKey];
    this.setState({filterList:item});
    // get index of object with id
    let componentArrList = idconst.filterList;
    console.log(componentArrList);

    //[uuid()]
    //let gid = idconst[idKey];
    //console.log(gid.id);
    //componentArrList.map((item)=>item.filter((i) => i.id !== gid.id));
    let removeIndex = completeArrList.map(function(item, index) { return item.id; }).indexOf(id);
    // remove object
    console.log(removeIndex);
    completeArrList.splice(removeIndex, 1);
    console.log(this.state);
    
    
    //let componentArrList = idconst[idKey];
    //console.log(componentArrList);
    //let gid = idconst[idKey];
    //console.log(gid.id);
    //componentArrList.map((item)=>item.filter((i) => i.id !== gid.id));
    // filterLists = componentArrList.filter((i) => i.id !== gid.id);
    // console.log(filterLists.length);
    // this.setState({filterList:filterLists});
    
    //idconst.map((i)=>console.log(i.id));
    //.filter((item) => item.id !== uuid());
    
    //console.log(this.setState([uuid()]: [] }));
    //const newList = this.state([]).filter((item) => item.id !== uuid());
    //this.setState({ [uuid()]: newList });
      //this.setState({ [source.droppableId] : newList });
  };

  

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    // console.log(this.state.itemHt, "itemHtitemHtitemHt");
    let stateFirstArr = [];
    let objKeys = Object.keys(this.state)[0];
    stateFirstArr.push(objKeys);
    
    return (
      
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="ITEMS" isDropDisabled={true}>
          {(provided, snapshot) => (
            
            <Kiosk
              ref={provided.innerRef}
              className="kioskkkkkkkk"
              isDraggingOver={snapshot.isDraggingOver}
              
            >
              <span><b>Drag the components</b></span>
              {ITEMS.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <React.Fragment>
                      <Item
                        className="item"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        isDragging={snapshot.isDragging}
                        style={provided.draggableProps.style}

                      >
                        {item.content}
                        
                      </Item>
                      {snapshot.isDragging && (
                        <Clone className="clone">{item.content}</Clone>
                      )}
                    </React.Fragment>
                  )}
                </Draggable>
              ))}
            </Kiosk>
          )}
        </Droppable>
        
        
        <Content className="content DashPreview-PreviewList">
          {/* <Button onClick={this.addList}>
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"
              />
            </svg>
            <ButtonText>Add List</ButtonText>
          </Button> */}

          <Button onClick={this.saveComponent} style={{display:'inline'}}>
            
            <ButtonText>Save</ButtonText>
          </Button>

          {/* <Button style={{display:'inline'}} onClick={this.clearallComponent}>
            
            <ButtonText>Clear All</ButtonText>
          </Button> */}
     
          {stateFirstArr.map((list, i) => (
            <Droppable key={list} droppableId={list}>
              {(provided, snapshot) => (
                <Container
                  ref={provided.innerRef}
                  isDraggingOver={snapshot.isDraggingOver}
                 onClick={this.handleMouseClick}
                >
                   <ReactGridLayout
                    key={"gridlayout"}
                    isResizable={this.state.isResize}
                    style={{ overflow: "auto" }}
                    onLayoutChange={this.onLayoutChange.bind(this)}
                    preventCollision
                    {...this.props}
                  >
                  
                    {this.state[list].length ? (
                      this.state[list].map((item, index) => (
                        
                        // item.content.type.name == 'StraightLine'?
                        // <ItemLineDropped
                        //   key={"item" + index}
                        //   className='drawLines'
                        //   onMouseOver={() => this.showResizable(item)}
                        //   onMouseOut={() => this.hideResizable(item)}
                        //   onDoubleClick={() => this.handleRemove(item)}
                          
                        // >
                        //     {console.log(item)}
                        //     {item.content} 
                        //   </ItemLineDropped>
                        //   : item.content.type.name == 'VerticalLine'?
                        //   <ItemLineDropped
                        //     key={"item" + index}
                        //     className='drawLines'
                        //     onMouseMove={() => this.showResizable(item)}
                        //     onMouseOut={() => this.hideResizable(item)}
                        //     onDoubleClick={() => this.handleRemove(item)}
                        //   >
                        //       {item.content} 
                        //     </ItemLineDropped> :
                        <ItemDropped
                          key={"item" + index}
                          data-grid={{
                            x: item.x,
                            y: item.y,
                            w: item.w,
                            h: item.h
                          }}

                          onMouseMove={() => this.showResizable(item)}
                          onMouseOut={() => this.hideResizable(item)}
                          
                          
                        >
                          {/* {console.log(item)} */}
                          {item.content}
                          <ItemBtn>
                          <Button className='removeBtn' key={'remove'} onClick={() => this.handleRemove(item)}>
            
                            <ButtonText>x</ButtonText>
                          </Button>
                          </ItemBtn>
                          {/* <LineTo from={index} to={index} /> */}
                          {/* <Line x0={120} y0={20} x1={item.w} y1={item.h} /> */}
                          {/* <Line x0={this.state.x} y0={50} x1={this.state.y} y1={20} /> */}
                        </ItemDropped>
                        
                        
                      ))
                    ) : (
                      <Notice>Drop items here</Notice>
                    )}
                    
                  </ReactGridLayout>
                  {provided.placeholder}
                  
                
                  
                </Container>
              )}
            </Droppable>
          ))}
        </Content>
       
      </DragDropContext>
      
    );
  }
}

//ReactDOM.render(<App />)

export default App;
