@extends('layouts.app')
@push('css')
    <link href="css/style.css" rel="stylesheet">
    <link href="css/bootstrap.min.css" rel="stylesheet">
@endpush
@push('js')
    <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.1/socket.io.js"></script>
    <script src="js/jquery-1.10.1.min.js"></script>
    <script src="js/script.js" ></script>
    <script type="text/javascript">
        var user_id ='{{auth()->user()->id}}';
        var username ='{{auth()->user()->name}}';
    </script>
@endpush
@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">chat</div>

                    <div class="card-body">
                        <p><label>Online: <input class="status" type="radio" checked name="status" value="online"></label></p>
                        <p><label>OFFline: <input class="status" type="radio" name="status" value="offline"></label></p>
                        <p><label>Busy: <input class="status" type="radio" name="status" value="bys"></label></p>
                        <p><label>Don't Disturb:<input class="status" type="radio" name="status" value="dnd"></label></p>
                        <div id="chat-sidebar">
                            @foreach(App\User::where('id','!=',auth()->user()->id)->get() as $user )
                                <div id="sidebar-user-box" class="user" uid="{{$user->id}}" >
                                    <img src="{{asset("image/user.png")}} " />
                                    <span id="slider-username">{{$user->name}}</span>
                                    <span class=" user_status user_{{$user->id}}"> &nbsp;</span>
                                </div>
                            @endforeach
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
