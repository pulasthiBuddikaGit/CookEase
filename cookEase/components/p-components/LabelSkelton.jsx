import React from 'react';

const LabelSkelton = () => {
  return (
    <View>
      <View style={styles.skeletonHeading} />
      {[1, 2, 3, 4, 5].map((_, index) => (
        <View key={index} style={styles.skeletonLabelItem} />
      ))}
      <View style={styles.skeletonSubmitBtn} />
    </View>
  );
};

const styles = StyleSheet.create({
    skeletonHeading: {
        height: 24,
        width: "60%",
        backgroundColor: "#f0f0f0",
        borderRadius: 4,
        marginBottom: 15,
      },
      skeletonLabelItem: {
        height: 50,
        width: "100%",
        backgroundColor: "#f0f0f0",
        borderRadius: 8,
        marginBottom: 10,
      },
      skeletonSubmitBtn: {
        height: 50,
        width: "100%",
        backgroundColor: "#f0f0f0",
        borderRadius: 8,
        marginTop: 20,
      }

});


export default LabelSkelton;