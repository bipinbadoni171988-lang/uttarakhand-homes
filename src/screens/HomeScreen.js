// At the very top of the main return function:
import NestupHeader from '../components/NestupHeader';
// ...
return (
  <View style={{ flex: 1 }}>
    <NestupHeader user={profile} />
    {/* ...rest of home screen */}
  </View>
);
// If there’s a search bar area, update its styles:
<SearchBar
  style={{
    margin: 16,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.background,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    fontFamily: FONTS.body,
    fontSize: 18,
    color: COLORS.text
  }}
/>
