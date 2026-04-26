import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';

const TP = [
  { id: '1', title: '3BHK House Dehradun', price: '45L', loc: 'Rajpur Road', type: 'sale' },
  { id: '2', title: 'Commercial Shop', price: '85L', loc: 'Haridwar Market', type: 'sale' },
  { id: '3', title: 'Villa Mussoorie', price: '98L', loc: 'Mussoorie', type: 'sale' },
];
const TR = [
  { id: '1', title: 'Swift Dzire Car', price: '1200/day', loc: 'Dehradun', type: 'rental' },
  { id: '2', title: 'Royal Enfield Bike', price: '800/day', loc: 'Rishikesh', type: 'rental' },
  { id: '3', title: '1BHK Furnished Flat', price: '12K/month', loc: 'Rajpur Road', type: 'rental' },
];
const TS = [
  { id: '1', title: 'Rajesh Kumar', price: '400/visit', loc: 'Plumber', type: 'service' },
  { id: '2', title: 'Deepak Negi', price: '500/visit', loc: 'Electrician', type: 'service' },
  { id: '3', title: 'Mohan Rawat', price: '200/sqft', loc: 'Painter', type: 'service' },
];

function Card({ item }) {
  const bg = item.type === 'sale' ? '#01696f' : item.type === 'rental' ? '#006494' : '#964219';
  return (
    <TouchableOpacity style={st.card}>
      <View style={[st.cardTop, { backgroundColor: bg }]}>
        <Text style={st.cardTitle}>{item.title}</Text>
        <Text style={st.cardPrice}>{item.price}</Text>
      </View>
      <View style={st.cardBot}>
        <Text style={st.cardLoc}>{item.loc}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={st.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={st.hdr}>
          <Text style={st.greet}>Namaste 🙏</Text>
          <Text style={st.tag}>What are you looking for today?</Text>
        </View>

        <View style={st.banners}>
          <TouchableOpacity style={[st.ban, { backgroundColor: '#01696f' }]}
            onPress={() => navigation && navigation.navigate('Properties')} activeOpacity={0.85}>
            <Text style={st.emoji}>🏠</Text>
            <View style={st.btxt}>
              <Text style={st.btitle}>Property for Sale</Text>
              <Text style={st.bsub}>Houses, Plots, Commercial</Text>
            </View>
            <View style={st.cta}><Text style={st.ctaTxt}>Browse</Text></View>
          </TouchableOpacity>

          <TouchableOpacity style={[st.ban, { backgroundColor: '#006494' }]}
            onPress={() => navigation && navigation.navigate('Rentals')} activeOpacity={0.85}>
            <Text style={st.emoji}>🚗</Text>
            <View style={st.btxt}>
              <Text style={st.btitle}>Rentals</Text>
              <Text style={st.bsub}>Cars, Bikes, Flats, Equipment</Text>
            </View>
            <View style={st.cta}><Text style={st.ctaTxt}>Browse</Text></View>
          </TouchableOpacity>

          <TouchableOpacity style={[st.ban, { backgroundColor: '#964219' }]}
            onPress={() => navigation && navigation.navigate('Services')} activeOpacity={0.85}>
            <Text style={st.emoji}>🔧</Text>
            <View style={st.btxt}>
              <Text style={st.btitle}>Services</Text>
              <Text style={st.bsub}>Plumbers, Electricians, Maids</Text>
            </View>
            <View style={st.cta}><Text style={st.ctaTxt}>Browse</Text></View>
          </TouchableOpacity>
        </View>

        <View style={st.sec}>
          <View style={st.secH}>
            <Text style={st.secT}>🔥 Trending Properties</Text>
            <TouchableOpacity onPress={() => navigation && navigation.navigate('Properties')}>
              <Text style={st.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList data={TP} horizontal showsHorizontalScrollIndicator={false}
            keyExtractor={i => i.id} renderItem={({ item }) => <Card item={item} />} />
        </View>

        <View style={st.sec}>
          <View style={st.secH}>
            <Text style={st.secT}>🔥 Trending Rentals</Text>
            <TouchableOpacity onPress={() => navigation && navigation.navigate('Rentals')}>
              <Text style={st.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList data={TR} horizontal showsHorizontalScrollIndicator={false}
            keyExtractor={i => i.id} renderItem={({ item }) => <Card item={item} />} />
        </View>

        <View style={st.sec}>
          <View style={st.secH}>
            <Text style={st.secT}>🔥 Trending Services</Text>
            <TouchableOpacity onPress={() => navigation && navigation.navigate('Services')}>
              <Text style={st.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList data={TS} horizontal showsHorizontalScrollIndicator={false}
            keyExtractor={i => i.id} renderItem={({ item }) => <Card item={item} />} />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f7f6f2' },
  hdr: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 },
  greet: { fontSize: 22, fontWeight: '700', color: '#28251d' },
  tag: { fontSize: 13, color: '#7a7974', marginTop: 2 },
  banners: { paddingHorizontal: 20, gap: 12 },
  ban: { borderRadius: 16, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14, elevation: 3, marginBottom: 4 },
  emoji: { fontSize: 28 },
  btxt: { flex: 1 },
  btitle: { fontSize: 16, fontWeight: '700', color: '#fff' },
  bsub: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  cta: { backgroundColor: '#fff', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20 },
  ctaTxt: { fontSize: 12, fontWeight: '600', color: '#28251d' },
  sec: { marginTop: 24, paddingHorizontal: 20 },
  secH: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  secT: { fontSize: 16, fontWeight: '700', color: '#28251d' },
  seeAll: { fontSize: 13, color: '#01696f', fontWeight: '600' },
  card: { width: 170, marginRight: 12, backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', elevation: 2 },
  cardTop: { padding: 14, minHeight: 75 },
  cardTitle: { fontSize: 13, fontWeight: '600', color: '#fff' },
  cardPrice: { fontSize: 14, fontWeight: '700', color: '#fff', marginTop: 6 },
  cardBot: { padding: 10 },
  cardLoc: { fontSize: 11, color: '#7a7974' },
});