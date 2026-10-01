import React from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import {typography} from '../../theme/typography';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const SalesExecutiveProjectShowcaseScreen = ({route}: any) => {
  const navigation = useNavigation<any>();
  const project = route.params?.project || {};

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerTitleBox}>
          <Text style={styles.headerTitle}>{project.name}</Text>
          <Text style={styles.headerSubtitle}>By Apex Realty Infra Pvt Ltd</Text>
        </View>
        <TouchableOpacity style={styles.contactBtn}>
          <Icon name="phone" size={16} color="#FFF" style={{marginRight: 6}} />
          <Text style={styles.contactBtnText}>Contact Sales</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll}>
        <View style={styles.heroSection}>
          <View style={styles.heroBadges}>
            <View style={[styles.badge, {backgroundColor: '#4B4DED'}]}><Text style={styles.badgeText}>{project.code}</Text></View>
            <View style={[styles.badge, {backgroundColor: 'rgba(255,255,255,0.2)'}]}><Text style={styles.badgeText}>RERA: P02400009876</Text></View>
            <View style={[styles.badge, {backgroundColor: colors.success}]}><Icon name="lightning-bolt" size={12} color="#FFF"/><Text style={styles.badgeText}>4 Units Ready / Available</Text></View>
          </View>
          <Text style={styles.heroTitle}>{project.name}</Text>
          <View style={styles.heroLocation}>
            <Icon name="map-marker" size={16} color="#4B4DED" />
            <Text style={styles.heroLocationText}>{project.location_address}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Configurations</Text>
            <Text style={styles.statVal}>2BHK, 3BHK</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Carpet Area</Text>
            <Text style={styles.statVal}>1,350 <Text style={styles.statUnit}>sq.ft</Text></Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Towers</Text>
            <Text style={[styles.statVal, {color: '#4B4DED'}]}>1 <Text style={styles.statUnit}>Towers</Text></Text>
          </View>
          <View style={[styles.statCard, {backgroundColor: '#ECFDF5', borderColor: '#A7F3D0'}]}>
            <Text style={styles.statLabel}>Starting Price</Text>
            <Text style={[styles.statVal, {color: colors.success}]}>₹82.00 Lakhs*</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon name="office-building" size={20} color="#4B4DED" style={{marginRight: 8}} />
              <Text style={styles.sectionTitle}>Towers & Building Structure</Text>
            </View>
            <Text style={styles.sectionSubtitle}>1 Active Buildings</Text>
          </View>
          <View style={styles.towerCard}>
            <View style={styles.towerCardHeader}>
              <View style={styles.towerBadge}><Text style={styles.towerBadgeText}>TWR-A</Text></View>
              <Text style={styles.towerFloors}>10 Floors</Text>
            </View>
            <Text style={styles.towerName}>Tower A (Luxury Block)</Text>
            <Text style={styles.towerConfig}>Configurations: <Text style={{fontWeight: 'bold', color: colors.text}}>2BHK, 3BHK</Text></Text>
            <View style={styles.towerFooter}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={styles.greenDot} />
                <Text style={styles.towerFooterAvail}>4 Units Available</Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.towerFooterLink}>Inquire Tower →</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon name="star" size={20} color={colors.warning} style={{marginRight: 8}} />
              <Text style={styles.sectionTitle}>Key Project Amenities</Text>
            </View>
          </View>
          <View style={styles.amenitiesList}>
            {['Clubhouse', 'Swimming Pool', 'Gym', 'EV Parking', 'Squash Court'].map((item, i) => (
              <View key={i} style={styles.amenityPill}>
                <View style={styles.amenityDot} />
                <Text style={styles.amenityText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.shareSection}>
          <View style={{flex: 1}}>
            <Text style={styles.shareTitle}>Share this Project with Friends & Family</Text>
            <Text style={styles.shareSubtitle}>Anyone with this link can view project details directly.</Text>
          </View>
          <View style={styles.shareButtons}>
            <TouchableOpacity style={styles.whatsappBtn}>
              <Icon name="whatsapp" size={16} color="#FFF" style={{marginRight: 6}} />
              <Text style={styles.whatsappBtnText}>Share on WhatsApp</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.copyBtn}>
              <Icon name="link" size={16} color={colors.text} style={{marginRight: 6}} />
              <Text style={styles.copyBtnText}>Copy Link</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2026 Apex Realty Infra Pvt Ltd. All Rights Reserved.</Text>
          <Text style={styles.footerText}>Powered by UrbanProperty Real Estate OS</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  header: {flexDirection: 'row', alignItems: 'center', padding: spacing.m, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: colors.border},
  backBtn: {marginRight: spacing.m},
  headerTitleBox: {flex: 1},
  headerTitle: {fontSize: 18, fontWeight: 'bold', color: colors.text},
  headerSubtitle: {fontSize: 12, color: '#4B4DED'},
  contactBtn: {flexDirection: 'row', alignItems: 'center', backgroundColor: '#4B4DED', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20},
  contactBtnText: {color: '#FFF', fontWeight: 'bold', fontSize: 13},
  scroll: {padding: spacing.m},
  heroSection: {backgroundColor: '#0F172A', borderRadius: 16, padding: spacing.xl, marginBottom: spacing.l, minHeight: 200, justifyContent: 'flex-end'},
  heroBadges: {flexDirection: 'row', gap: 8, marginBottom: spacing.m},
  badge: {flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 16, gap: 4},
  badgeText: {color: '#FFF', fontSize: 10, fontWeight: 'bold'},
  heroTitle: {color: '#FFF', fontSize: 28, fontWeight: 'bold', marginBottom: spacing.s},
  heroLocation: {flexDirection: 'row', alignItems: 'center', gap: 6},
  heroLocationText: {color: '#E2E8F0', fontSize: 14},
  statsRow: {flexDirection: 'row', gap: spacing.m, marginBottom: spacing.xl, flexWrap: 'wrap'},
  statCard: {flex: 1, minWidth: 150, backgroundColor: '#FFF', padding: spacing.m, borderRadius: 12, borderWidth: 1, borderColor: colors.border},
  statLabel: {fontSize: 12, color: colors.textSecondary, marginBottom: 8},
  statVal: {fontSize: 18, fontWeight: 'bold', color: colors.text},
  statUnit: {fontSize: 14, fontWeight: 'normal', color: colors.textSecondary},
  section: {backgroundColor: '#FFF', borderRadius: 16, padding: spacing.m, marginBottom: spacing.l, borderWidth: 1, borderColor: colors.border},
  sectionHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.m},
  sectionTitle: {fontSize: 16, fontWeight: 'bold', color: colors.text},
  sectionSubtitle: {fontSize: 12, color: colors.textSecondary},
  towerCard: {borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: spacing.m, backgroundColor: '#F9FAFB'},
  towerCardHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.s},
  towerBadge: {backgroundColor: '#EEF2FF', borderWidth: 1, borderColor: '#C7D2FE', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4},
  towerBadgeText: {color: '#4B4DED', fontSize: 10, fontWeight: 'bold'},
  towerFloors: {fontSize: 12, color: colors.textSecondary, fontWeight: 'bold'},
  towerName: {fontSize: 16, fontWeight: 'bold', color: colors.text, marginBottom: 4},
  towerConfig: {fontSize: 12, color: colors.textSecondary, marginBottom: spacing.m},
  towerFooter: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: spacing.m, borderTopWidth: 1, borderTopColor: colors.border},
  greenDot: {width: 8, height: 8, borderRadius: 4, backgroundColor: colors.success, marginRight: 6},
  towerFooterAvail: {fontSize: 12, fontWeight: 'bold', color: colors.success},
  towerFooterLink: {fontSize: 12, fontWeight: 'bold', color: '#4B4DED'},
  amenitiesList: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.m},
  amenityPill: {flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: colors.border, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8},
  amenityDot: {width: 6, height: 6, borderRadius: 3, backgroundColor: '#4B4DED', marginRight: 8},
  amenityText: {fontSize: 13, color: colors.text},
  shareSection: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF', padding: spacing.m, borderRadius: 16, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.xl, flexWrap: 'wrap', gap: spacing.m},
  shareTitle: {fontSize: 14, fontWeight: 'bold', color: colors.text, marginBottom: 4},
  shareSubtitle: {fontSize: 12, color: colors.textSecondary},
  shareButtons: {flexDirection: 'row', gap: spacing.m},
  whatsappBtn: {flexDirection: 'row', alignItems: 'center', backgroundColor: '#10B981', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8},
  whatsappBtnText: {color: '#FFF', fontWeight: 'bold', fontSize: 13},
  copyBtn: {flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderWidth: 1, borderColor: colors.border, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8},
  copyBtnText: {color: colors.text, fontWeight: 'bold', fontSize: 13},
  footer: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.l, borderTopWidth: 1, borderTopColor: colors.border, flexWrap: 'wrap', gap: spacing.s},
  footerText: {fontSize: 12, color: colors.textSecondary},
});
