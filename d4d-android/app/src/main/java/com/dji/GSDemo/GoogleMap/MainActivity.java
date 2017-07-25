package com.dji.GSDemo.GoogleMap;

import android.Manifest;
import android.app.AlertDialog;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.IntentFilter;
import android.graphics.Color;
import android.os.Build;
import android.support.v4.app.ActivityCompat;
import android.support.v4.app.FragmentActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.RadioGroup;
import android.widget.TextView;
import android.widget.Toast;
import com.google.android.gms.maps.CameraUpdate;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.android.gms.maps.model.PolygonOptions;

import android.support.design.widget.FloatingActionButton;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import dji.common.camera.DJICameraSettingsDef;
import dji.common.flightcontroller.DJIFlightControllerCurrentState;
import dji.common.util.DJICommonCallbacks;
import dji.sdk.camera.DJICamera;
import dji.sdk.flightcontroller.DJIFlightController;
import dji.sdk.flightcontroller.DJIFlightControllerDelegate;
import dji.sdk.missionmanager.DJIMission;
import dji.sdk.missionmanager.DJIMissionManager;
import dji.sdk.missionmanager.DJIWaypoint;
import dji.sdk.missionmanager.DJIWaypointMission;
import dji.sdk.products.DJIAircraft;
import dji.sdk.base.DJIBaseProduct;
import dji.common.error.DJIError;

import static dji.internal.d.b.a.b;

//TO-DO
// add onClickListener to floating button

public class MainActivity extends FragmentActivity implements View.OnClickListener, GoogleMap.OnMapClickListener, OnMapReadyCallback, DJIMissionManager.MissionProgressStatusCallback, DJICommonCallbacks.DJICompletionCallback {

    protected static final String TAG = "GSDemoActivity";

    private GoogleMap gMap;

//    private Button add, clear;
//    private Button stop;

    private boolean isAdd = false;

    private double droneLocationLat = 181, droneLocationLng = 181;
    private final Map<Integer, Marker> mMarkers = new ConcurrentHashMap<Integer, Marker>();
    private Marker droneMarker = null;

    private float altitude = 50.0f;
    private float mSpeed = 10.0f;

    private DJIWaypointMission mWaypointMission;
    private DJIMissionManager mMissionManager;
    private DJIFlightController mFlightController;

    private DJIWaypointMission.DJIWaypointMissionFinishedAction mFinishedAction = DJIWaypointMission.DJIWaypointMissionFinishedAction.NoAction;
    private DJIWaypointMission.DJIWaypointMissionHeadingMode mHeadingMode = DJIWaypointMission.DJIWaypointMissionHeadingMode.Auto;

    private FloatingActionButton locate, config, start, prepare, camera, btnNext;

    private LatLng l1;

    @Override
    protected void onResume(){
        super.onResume();
        initFlightController();
        initMissionManager();


    }

    @Override
    protected void onPause(){
        super.onPause();
    }

    @Override
    protected void onDestroy(){
        super.onDestroy();
        unregisterReceiver(mReceiver);
    }

    /**
     * @Description : RETURN Button RESPONSE FUNCTION
     */
    public void onReturn(View view){
        Log.d(TAG, "onReturn");
        this.finish();
    }

    private void setResultToToast(final String string){
        MainActivity.this.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Toast.makeText(MainActivity.this, string, Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void initUI() {

        locate = (FloatingActionButton) findViewById(R.id.locate);
//        add = (Button) findViewById(R.id.add);
//        clear = (Button) findViewById(R.id.clear);
        config = (FloatingActionButton) findViewById(R.id.config);
        prepare = (FloatingActionButton) findViewById(R.id.prepare);
        start = (FloatingActionButton) findViewById(R.id.start);
        camera = (FloatingActionButton) findViewById(R.id.camera);
        btnNext = (FloatingActionButton) findViewById(R.id.btnNext);
//        stop = (Button) findViewById(R.id.stop);

        locate.setOnClickListener(this);
//        add.setOnClickListener(this);
//        clear.setOnClickListener(this);
        config.setOnClickListener(this);
        prepare.setOnClickListener(this);
        start.setOnClickListener(this);
        camera.setOnClickListener(this);
        btnNext.setOnClickListener(this);
//        stop.setOnClickListener(this);


    }


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // When the compile and target version is higher than 22, please request the
        // following permissions at runtime to ensure the
        // SDK work well.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            ActivityCompat.requestPermissions(this,
                    new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE, Manifest.permission.VIBRATE,
                            Manifest.permission.INTERNET, Manifest.permission.ACCESS_WIFI_STATE,
                            Manifest.permission.WAKE_LOCK, Manifest.permission.ACCESS_COARSE_LOCATION,
                            Manifest.permission.ACCESS_NETWORK_STATE, Manifest.permission.ACCESS_FINE_LOCATION,
                            Manifest.permission.CHANGE_WIFI_STATE, Manifest.permission.MOUNT_UNMOUNT_FILESYSTEMS,
                            Manifest.permission.READ_EXTERNAL_STORAGE, Manifest.permission.SYSTEM_ALERT_WINDOW,
                            Manifest.permission.READ_PHONE_STATE,
                    }
                    , 1);
        }

        setContentView(R.layout.activity_main);

        IntentFilter filter = new IntentFilter();
        filter.addAction(DJIDemoApplication.FLAG_CONNECTION_CHANGE);
        registerReceiver(mReceiver, filter);

        initUI();

        SupportMapFragment mapFragment = (SupportMapFragment) getSupportFragmentManager()
                .findFragmentById(R.id.map);
        mapFragment.getMapAsync(this);

        /*sample path*/
//        double lat[]={6.90118,6.901177,6.90118,6.901196,6.90106,6.901055,6.90106,6.901068,6.900952,6.900933,6.900938,6.900951};
//        double lng[]={79.861088,79.860914,79.860689,79.860541,79.860536,79.86069,79.860886,79.861093,79.861096,79.860868,79.860568,79.860319};
//        int alt[] = {20,20,20,20,30,30,30,30,20,20,20,20};
        Intent in = getIntent();
//        String str = in.getStringExtra("data");
//        decodeData(str);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  

        double lat[]={6.90118,6.901177,6.90118,6.901196,6.90106,6.901055,6.90106,6.901068,6.900952,6.900933,6.900938,6.900951};
        double lng[]={79.861088,79.860914,79.860689,79.860541,79.860536,79.86069,79.860886,79.861093,79.861096,79.860868,79.860568,79.860319};
        int alt[] = {20,20,20,20,30,30,30,30,20,20,20,20};
        /**Add waypoint**/
        Log.d(TAG,""+lat.length);
        LatLng tmp;

        for (int i = 0; i < lat.length; i++) {
            tmp = new LatLng(lat[i],lng[i]);
            DJIWaypoint mWaypoint = new DJIWaypoint(tmp.latitude, tmp.longitude,alt[i]);
            if (mWaypointMission != null) {
                mWaypointMission.addWaypoint(mWaypoint);
            }
        }
        isAdd=false;
    }

/*
    public void decodeData(String test){
        test=test.replace(")(", ",");
        test=test.replace("[(","");
        test=test.replace(")]","");
        //System.out.println(test);
        List<String> lst = Arrays.asList(test.split(","));
        int len = lst.size();
        //System.out.println(len);
        lat = new double[len/3];
        lng = new double[len/3];
        alt = new float[len/3];
        //System.out.println(lst);
        int j=0;
        for(int i=0; i<len;){
            lat[j]=Double.parseDouble(lst.get(i++));
            lng[j]=Double.parseDouble(lst.get(i++));
            alt[j++]=Float.parseFloat(lst.get(i++));
        }
        for (int x=0;x<len/3;x++){
            Log.d(TAG, ""+lat[x]+","+lng[x]+","+alt[x]);
        }
    }
*/

    protected BroadcastReceiver mReceiver = new BroadcastReceiver() {

        @Override
        public void onReceive(Context context, Intent intent) {
            onProductConnectionChange();
        }
    };

    private void onProductConnectionChange()
    {
        initMissionManager();
        initFlightController();
    }

    private void initMissionManager() {
        DJIBaseProduct product = DJIDemoApplication.getProductInstance();

        if (product == null || !product.isConnected()) {
            setResultToToast("Disconnected");
            mMissionManager = null;
//            start.setEnabled(false);
            return;
        } else {
            setResultToToast("Product connected");
            mMissionManager = product.getMissionManager();
            mMissionManager.setMissionProgressStatusCallback(this);
            mMissionManager.setMissionExecutionFinishedCallback(this);
//            start.setEnabled(true);
        }

        mWaypointMission = new DJIWaypointMission();
    }

    private void initFlightController() {

        DJIBaseProduct product = DJIDemoApplication.getProductInstance();
        if (product != null && product.isConnected()) {
            if (product instanceof DJIAircraft) {
                mFlightController = ((DJIAircraft) product).getFlightController();
            }
        }

        if (mFlightController != null) {
            mFlightController.setUpdateSystemStateCallback(new DJIFlightControllerDelegate.FlightControllerUpdateSystemStateCallback() {

                @Override
                public void onResult(DJIFlightControllerCurrentState state) {
                    droneLocationLat = state.getAircraftLocation().getLatitude();
                    droneLocationLng = state.getAircraftLocation().getLongitude();
                    updateDroneLocation();
                }
            });
        }
    }

    /**
     * DJIMissionManager Delegate Methods
     */
    @Override
    public void missionProgressStatus(DJIMission.DJIMissionProgressStatus progressStatus) {

    }

    /**
     * DJIMissionManager Delegate Methods
     */
    @Override
    public void onResult(DJIError error) {
        setResultToToast("Execution finished: " + (error == null ? "Success!" : error.getDescription()));
    }

    private void setUpMap() {
        gMap.setOnMapClickListener(this);// add the listener for click for amap object

    }
    //LatLng(1, lat, lng)
    private void markWaypoint(LatLng point){
        //Create MarkerOptions object
        MarkerOptions markerOptions = new MarkerOptions();
        markerOptions.position(point);
        markerOptions.icon(BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_BLUE));
        Marker marker = gMap.addMarker(markerOptions);
        mMarkers.put(mMarkers.size(), marker);
    }

    @Override
    public void onMapClick(LatLng point) {

        if (isAdd == true){
            markWaypoint(point);
            DJIWaypoint mWaypoint = new DJIWaypoint(point.latitude, point.longitude, altitude);
            //Add Waypoints to Waypoint arraylist;
            if (mWaypointMission != null) {
                mWaypointMission.addWaypoint(mWaypoint);
            }
        }else{
            setResultToToast("Cannot Add Waypoint.First click on add button.");
        }
    }

    public static boolean checkGpsCoordination(double latitude, double longitude) {
        return (latitude > -90 && latitude < 90 && longitude > -180 && longitude < 180) && (latitude != 0f && longitude != 0f);
    }

    // Update the drone location based on states from MCU.
    private void updateDroneLocation(){
        LatLng pos = new LatLng(droneLocationLat, droneLocationLng);
        //Create MarkerOptions object
        final MarkerOptions markerOptions = new MarkerOptions();
        markerOptions.position(pos);
        markerOptions.icon(BitmapDescriptorFactory.fromResource(R.drawable.drone1));

        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (droneMarker != null) {
                    droneMarker.remove();
                }

                if (checkGpsCoordination(droneLocationLat, droneLocationLng)) {
                    droneMarker = gMap.addMarker(markerOptions);
                }
            }
        });
    }



    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.locate:{
                updateDroneLocation();
                cameraUpdate(); // Locate the drone's place
                break;
            }
//            case R.id.add:{
//                enableDisableAdd();
//                break;
//            }
//            case R.id.clear:{
//                runOnUiThread(new Runnable() {
//                    @Override
//                    public void run() {
//                        gMap.clear();
//                    }
//
//                });
//                if (mWaypointMission != null){
//                    mWaypointMission.removeAllWaypoints(); // Remove all the waypoints added to the task
//                }
//                break;
//            }
            case R.id.config:{
                showSettingDialog();
                break;
            }
            case R.id.prepare:{
                prepareWayPointMission();
                break;
            }
            case R.id.start:{
                startWaypointMission();
                break;
            }case R.id.camera:{
                captureAction();
                break;
            }
            case R.id.btnNext:{
                Intent fireBase1 = new Intent(MainActivity.this, FireBaseActivity.class);
                startActivity(fireBase1);
            }
            default:
                break;
        }
    }

    private void cameraUpdate(){
        LatLng pos = new LatLng(droneLocationLat, droneLocationLng);
        float zoomlevel = (float) 18.0;
        CameraUpdate cu = CameraUpdateFactory.newLatLngZoom(pos, zoomlevel);
        gMap.moveCamera(cu);

    }

//    private void enableDisableAdd(){
//        if (isAdd == false) {
//            isAdd = true;
//            add.setText("Exit");
//        }else{
//            isAdd = false;
//            add.setText("Add");
//        }
//    }

    private void showSettingDialog(){
        LinearLayout wayPointSettings = (LinearLayout)getLayoutInflater().inflate(R.layout.dialog_waypointsetting, null);

        final TextView wpAltitude_TV = (TextView) wayPointSettings.findViewById(R.id.altitude);
        RadioGroup speed_RG = (RadioGroup) wayPointSettings.findViewById(R.id.speed);
        RadioGroup actionAfterFinished_RG = (RadioGroup) wayPointSettings.findViewById(R.id.actionAfterFinished);
        RadioGroup heading_RG = (RadioGroup) wayPointSettings.findViewById(R.id.heading);

        speed_RG.setOnCheckedChangeListener(new RadioGroup.OnCheckedChangeListener(){

            @Override
            public void onCheckedChanged(RadioGroup group, int checkedId) {
                if (checkedId == R.id.lowSpeed){
                    mSpeed = 3.0f;
                } else if (checkedId == R.id.MidSpeed){
                    mSpeed = 5.0f;
                } else if (checkedId == R.id.HighSpeed){
                    mSpeed = 10.0f;
                }
            }

        });

        actionAfterFinished_RG.setOnCheckedChangeListener(new RadioGroup.OnCheckedChangeListener() {

            @Override
            public void onCheckedChanged(RadioGroup group, int checkedId) {
                Log.d(TAG, "Select finish action");
                if (checkedId == R.id.finishNone){
                    mFinishedAction = DJIWaypointMission.DJIWaypointMissionFinishedAction.NoAction;
                } else if (checkedId == R.id.finishGoHome){
                    mFinishedAction = DJIWaypointMission.DJIWaypointMissionFinishedAction.GoHome;
                } else if (checkedId == R.id.finishAutoLanding){
                    mFinishedAction = DJIWaypointMission.DJIWaypointMissionFinishedAction.AutoLand;
                } else if (checkedId == R.id.finishToFirst){
                    mFinishedAction = DJIWaypointMission.DJIWaypointMissionFinishedAction.GoFirstWaypoint;
                }
            }
        });

        heading_RG.setOnCheckedChangeListener(new RadioGroup.OnCheckedChangeListener() {

            @Override
            public void onCheckedChanged(RadioGroup group, int checkedId) {
                Log.d(TAG, "Select heading");

                if (checkedId == R.id.headingNext) {
                    mHeadingMode = DJIWaypointMission.DJIWaypointMissionHeadingMode.Auto;
                } else if (checkedId == R.id.headingInitDirec) {
                    mHeadingMode = DJIWaypointMission.DJIWaypointMissionHeadingMode.UsingInitialDirection;
                } else if (checkedId == R.id.headingRC) {
                    mHeadingMode = DJIWaypointMission.DJIWaypointMissionHeadingMode.ControlByRemoteController;
                } else if (checkedId == R.id.headingWP) {
                    mHeadingMode = DJIWaypointMission.DJIWaypointMissionHeadingMode.UsingWaypointHeading;
                }
            }
        });

        new AlertDialog.Builder(this)
                .setTitle("")
                .setView(wayPointSettings)
                .setPositiveButton("Finish",new DialogInterface.OnClickListener(){
                    public void onClick(DialogInterface dialog, int id) {

                        String altitudeString = wpAltitude_TV.getText().toString();
                        altitude = Integer.parseInt(nulltoIntegerDefalt(altitudeString));
                        //Toast.makeText(MainActivity.this, ""+altitudeString, Toast.LENGTH_SHORT).show();
                        Log.e(TAG,"altitude "+altitude);
                        Log.e(TAG,"speed "+mSpeed);
                        Log.e(TAG, "mFinishedAction "+mFinishedAction);
                        Log.e(TAG, "mHeadingMode "+mHeadingMode);
                        configWayPointMission();
                    }

                })
                .setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {
                        dialog.cancel();
                    }
                })
                .create()
                .show();
    }

    String nulltoIntegerDefalt(String value){
        if(!isIntValue(value)) value="0";
        return value;
    }

    boolean isIntValue(String val)
    {
        try {
            val=val.replace(" ","");
            Integer.parseInt(val);
        } catch (Exception e) {return false;}
        return true;
    }

    private void configWayPointMission(){

        if (mWaypointMission != null){
            mWaypointMission.finishedAction = mFinishedAction;
            mWaypointMission.headingMode = mHeadingMode;
            mWaypointMission.autoFlightSpeed = mSpeed;

            if (mWaypointMission.waypointsList.size() > 0){
                for (int i=0; i< mWaypointMission.waypointsList.size(); i++){
                    mWaypointMission.getWaypointAtIndex(i).altitude = altitude;
                }
                setResultToToast("Set Waypoint attitude successfully");
            }
       }
    }

    private void prepareWayPointMission(){

        if (mMissionManager != null && mWaypointMission != null) {

            DJIMission.DJIMissionProgressHandler progressHandler = new DJIMission.DJIMissionProgressHandler() {
                @Override
                public void onProgress(DJIMission.DJIProgressType type, float progress) {
                }
            };

            mMissionManager.prepareMission(mWaypointMission, progressHandler, new DJICommonCallbacks.DJICompletionCallback() {
                @Override
                public void onResult(DJIError error) {
                    setResultToToast(error == null ? "Mission Prepare Successfully" : error.getDescription());
                }
            });
        }

    }

    private void startWaypointMission(){
        if (mMissionManager != null) {
            mMissionManager.startMissionExecution(new DJICommonCallbacks.DJICompletionCallback() {
                @Override
                public void onResult(DJIError error) {
                    setResultToToast("Mission Start: " + (error == null ? "Successfully" : error.getDescription()));
                }
            });

        }
//        LatLng st,en;
//        st = new LatLng(mWaypointMission.getWaypointAtIndex(0).latitude,mWaypointMission.getWaypointAtIndex(0).longitude);
//        int len = mWaypointMission.waypointsList.size();
//        en = new LatLng(mWaypointMission.getWaypointAtIndex(len).latitude,mWaypointMission.getWaypointAtIndex(len).longitude);
//        TakePhoto(st,en);
        /*
        if (droneLocation==first_gps_location){start camera function}
        if(droneLocation==end_gps_location) {end camera function}
        */


    }

    private void stopWaypointMission(){

        if (mMissionManager != null) {
            mMissionManager.stopMissionExecution(new DJICommonCallbacks.DJICompletionCallback() {

                @Override
                public void onResult(DJIError error) {
                    setResultToToast("Mission Stop: " + (error == null ? "Successfully" : error.getDescription()));
                }
            });

            if (mWaypointMission != null){
                mWaypointMission.removeAllWaypoints();
            }
        }
    }

    @Override
    public void onMapReady(GoogleMap googleMap) {
        if (gMap == null) {
            gMap = googleMap;
            setUpMap();
        }

        LatLng UCSC = new LatLng(6.902265, 79.861338);
        gMap.addMarker(new MarkerOptions().position(UCSC).title("Marker in UCSC"));
        gMap.moveCamera(CameraUpdateFactory.newLatLng(UCSC));
        gMap.animateCamera(CameraUpdateFactory.newLatLngZoom(UCSC,18));


        double lat[]={6.90118,6.901177,6.90118,6.901196,6.90106,6.901055,6.90106,6.901068,6.900952,6.900933,6.900938,6.900951};
        double lng[]={79.861088,79.860914,79.860689,79.860541,79.860536,79.86069,79.860886,79.861093,79.861096,79.860868,79.860568,79.860319};
        LatLng pos = new LatLng(droneLocationLat, droneLocationLng);
        drawPolygon(gMap,lat,lng,pos);
    }




    public void drawPolygon(GoogleMap gmap, double[] lat, double[] lng, LatLng l) {
        int length = lat.length;
        if(length == 0)
        {
            return;
        }
        PolygonOptions poly = new PolygonOptions();
        poly.strokeColor(Color.RED);
        poly.fillColor(0x00000000);
        poly.add(l);
        for(int i = 0; i < length; i++)
        {
            poly.add(new LatLng(lat[i], lng[i]));
        }
        gmap.addPolygon(poly);
    }

    public void drawPolygon(GoogleMap gmap, double[] lat, double[] lng) {
        int length = lat.length;
        if(length == 0)
        {
            return;
        }
        PolygonOptions poly = new PolygonOptions();
        poly.strokeColor(Color.RED);
        poly.fillColor(0x00000000);
        for(int i = 0; i < length; i++)
        {
            poly.add(new LatLng(lat[i], lng[i]));
        }
        gmap.addPolygon(poly);
    }
                /*-----------------Camera Methods-----------------*/

    public void showToast(final String msg) {
        runOnUiThread(new Runnable() {
            public void run() {
                Toast.makeText(MainActivity.this, msg, Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void captureAction(){

        DJICameraSettingsDef.CameraMode cameraMode = DJICameraSettingsDef.CameraMode.ShootPhoto;

        final DJICamera camera = FPVApplication.getCameraInstance();
        if (camera != null) {

            DJICameraSettingsDef.CameraShootPhotoMode photoMode = DJICameraSettingsDef.CameraShootPhotoMode.Single; // Set the camera capture mode as Single mode
            camera.startShootPhoto(photoMode, new DJICommonCallbacks.DJICompletionCallback() {

                @Override
                public void onResult(DJIError error) {
                    if (error == null) {
                        showToast("take photo: success");
                    } else {
                        showToast(error.getDescription());
                    }
                }
            }); // Execute the startShootPhoto API
        }
    }

    public void TakePhoto(LatLng start, LatLng end){
        LatLng pos = new LatLng(droneLocationLat, droneLocationLng);
        if(pos==start) {
            try {
                while (pos==end) {
//                System.out.println("Hello world");
                    captureAction();
                    Thread.sleep(1000); // every 1 seconds
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}
