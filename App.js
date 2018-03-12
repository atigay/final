import React from 'react';
import { ListView, StyleSheet, View } from 'react-native';
import { Body, Title, Right, Container, Header, Content, Footer, FooterTab, Button, Icon, List, ListItem, Text, Thumbnail } from 'native-base';

export default class App extends React.Component {
  constructor() {
    super();
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      data: []
    }
  }

  // Retrieve the list of ideas from Airtable
  getItems() {
    // Airtable API endpoint, replace with your own
    let airtableUrl = "https://api.airtable.com/v0/appkuqJQ1ttYDrdcV/data/";

    // Needed for Airtable authorization, replace with your own API key
    let requestOptions = {
      headers: new Headers({
        'Authorization': 'Bearer keyczgwZNgfUt8weN'
      })
    };

    // Form the request
    let request = new Request(airtableUrl, requestOptions);

    // Make the request
    fetch(request).then(response => response.json()).then(json => {
      this.setState({
        data: json.records
      });
    });
  }

  // Runs when the application loads (i.e. the "App" component "mounts")
  componentDidMount() {
    this.getItems(); // refresh the list when we're done
  }

  // Upvote an idea
  upvoteIdea(data, secId, rowId, rowMap) {
    // Slide the row back into place
    rowMap[`${secId}${rowId}`].props.closeRow();

    // Airtable API endpoint
    let airtableUrl = "https://api.airtable.com/v0/appkuqJQ1ttYDrdcV/data/" + data.id;

    // Needed for Airtable authorization
    let requestOptions = {
      method: 'PATCH',
      headers: new Headers({
        'Authorization': 'Bearer keyczgwZNgfUt8weN', // replace with your own API key
        'Content-type': 'application/json'
      }),
      body: JSON.stringify({
        fields: {
          itemCount: data.fields.itemCount + 1
        }
      })
    };

    // Form the request
    let request = new Request(airtableUrl, requestOptions);

    // Make the request
    fetch(request).then(response => response.json()).then(json => {
      this.getItems(); // refresh the list when we're done
    });
  }

  // Downvote an idea
  downvoteIdea(data, secId, rowId, rowMap) {
    // Slide the row back into place
    rowMap[`${secId}${rowId}`].props.closeRow();

    // Airtable API endpoint
    let airtableUrl = "https://api.airtable.com/v0/appkuqJQ1ttYDrdcV/data/" + data.id;

    // Needed for Airtable authorization
    let requestOptions = {
      method: 'PATCH',
      headers: new Headers({
        'Authorization': 'Bearer keyczgwZNgfUt8weN', // replace with your own API key
        'Content-type': 'application/json'
      }),
      body: JSON.stringify({
        fields: {
          itemCount: data.fields.itemCount - 1
        }
      })
    };

    // Form the request
    let request = new Request(airtableUrl, requestOptions);

    // Make the request
    fetch(request).then(response => response.json()).then(json => {
      this.getItems(); // refresh the list when we're done
    });
  }


  // The UI for each row of data
  renderRow(data) {
    return (
      <ListItem style={{ paddingLeft: 20, paddingRight: 20 }}>
        <Thumbnail square size={80} source={{uri: data.fields.itemUrl}} />
        <Body>
          <Text>{data.fields.item}</Text>
        </Body>
          <Right>
          <Text note>QTY {data.fields.itemCount}</Text>
          </Right>
      </ListItem>
    )
  }

  // The UI for what appears when you swipe right
  renderSwipeRight(data, secId, rowId, rowMap) {
    return (
      <Button full success onPress={() => this.upvoteIdea(data, secId, rowId, rowMap)}>
        <Icon active name="add-circle" />
      </Button>
    )
  }

  // The UI for what appears when you swipe left
  renderSwipeLeft(data, secId, rowId, rowMap) {
    return (
      <Button full danger onPress={() => this.downvoteIdea(data, secId, rowId, rowMap)}>
        <Icon active name="remove-circle" />
      </Button>
    )
  }

  render() {
    let rows = this.ds.cloneWithRows(this.state.data);
    return (
      <Container>
        <Header>
          <Body>
            <Title>TabCaptain Restaurant Ordering System</Title>
          </Body>
        </Header>
        <Content>
          <List
            dataSource={rows}
            renderRow={(data) => this.renderRow(data)}
            renderLeftHiddenRow={(data, secId, rowId, rowMap) => this.renderSwipeRight(data, secId, rowId, rowMap)}
            renderRightHiddenRow={(data, secId, rowId, rowMap) => this.renderSwipeLeft(data, secId, rowId, rowMap)}
            leftOpenValue={75}
            rightOpenValue={-75}
          />
          </Content>
          <Footer>
            <FooterTab>
              <Button vertical active>
                <Icon name="pizza" />
                  <Text>Food</Text>
              </Button>
              <Button vertical>
                <Icon name="beer" />
                  <Text>Drink</Text>
              </Button>
              <Button vertical>
                <Icon name="cart" />
                  <Text>Close Tab</Text>
              </Button>
            </FooterTab>
          </Footer>
      </Container>
    );
  }
}
